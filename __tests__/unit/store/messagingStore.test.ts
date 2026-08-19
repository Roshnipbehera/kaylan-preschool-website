import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  connected: false,
};

vi.mock("@/lib/socket/client", () => ({
  getSocket: vi.fn(() => mockSocket),
  conversationRoom: (id: string) => `conversation:${id}`,
}));

vi.mock("@/lib/api/messaging", () => ({
  listConversations: vi.fn(),
  listMessages: vi.fn(),
  sendMessage: vi.fn(),
  markRead: vi.fn(),
}));

import { useMessagingStore } from "@/lib/messaging/store";
import * as api from "@/lib/api/messaging";

function resetStore() {
  useMessagingStore.setState({
    conversations: [],
    activeConversationId: null,
    messagesByConversation: {},
    nextCursorByConversation: {},
    onlineUserIds: new Set(),
    typingByConversation: {},
    connected: false,
  });
}

describe("useMessagingStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetStore();
  });

  it("loadConversations populates state from the API", async () => {
    const conversations = [{ id: "c1", unreadCount: 2 }] as any;
    vi.mocked(api.listConversations).mockResolvedValue(conversations);

    await useMessagingStore.getState().loadConversations();

    expect(useMessagingStore.getState().conversations).toEqual(conversations);
  });

  it("send appends the new message to the conversation's message list", async () => {
    const message = { id: "m1", conversationId: "c1", body: "hi", createdAt: "2026-01-01" } as any;
    vi.mocked(api.sendMessage).mockResolvedValue(message);

    await useMessagingStore.getState().send("c1", "hi");

    expect(useMessagingStore.getState().messagesByConversation["c1"]).toEqual([message]);
  });

  it("send does not duplicate a message that is already present (e.g. arrived via socket first)", async () => {
    const message = { id: "m1", conversationId: "c1", body: "hi", createdAt: "2026-01-01" } as any;
    useMessagingStore.setState({ messagesByConversation: { c1: [message] } });
    vi.mocked(api.sendMessage).mockResolvedValue(message);

    await useMessagingStore.getState().send("c1", "hi");

    expect(useMessagingStore.getState().messagesByConversation["c1"]).toHaveLength(1);
  });

  it("markConversationRead resets unreadCount to 0 for the given conversation", async () => {
    const message = { id: "m1", conversationId: "c1", body: "hi", createdAt: "2026-01-01" } as any;
    useMessagingStore.setState({
      messagesByConversation: { c1: [message] },
      conversations: [{ id: "c1", unreadCount: 5 } as any],
    });
    vi.mocked(api.markRead).mockResolvedValue(undefined);

    await useMessagingStore.getState().markConversationRead("c1");

    expect(useMessagingStore.getState().conversations[0].unreadCount).toBe(0);
  });

  it("setActiveConversation emits join/leave events and updates state", () => {
    useMessagingStore.getState().setActiveConversation("c1");
    expect(mockSocket.emit).toHaveBeenCalledWith("join_conversation", "c1");
    expect(useMessagingStore.getState().activeConversationId).toBe("c1");

    useMessagingStore.getState().setActiveConversation("c2");
    expect(mockSocket.emit).toHaveBeenCalledWith("leave_conversation", "c1");
    expect(mockSocket.emit).toHaveBeenCalledWith("join_conversation", "c2");
  });
});
