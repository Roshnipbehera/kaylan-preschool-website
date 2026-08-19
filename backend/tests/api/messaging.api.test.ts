import { prismaMock } from "../helpers/prismaMock";
import request from "supertest";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/utils/token";

const app = createApp();

// POST/PATCH here are mutating and NOT on the CSRF exempt-path list (see
// src/middleware/csrf.ts), so every request below carries a matching
// cookie+header CSRF pair, as a real browser session would after loading
// any page from this API.
const CSRF_TOKEN = "test-csrf-token-0123456789";
function cookies(accessToken?: string) {
  const list = [`kaylan_csrf_token=${CSRF_TOKEN}`];
  if (accessToken) list.push(`kaylan_access_token=${accessToken}`);
  return list;
}

function tokenFor(id: string, role: "PARENT" | "TEACHER" | "ADMIN") {
  return signAccessToken({ id, role, email: `${id}@example.com`, name: id });
}

describe("POST /api/v1/conversations - role-pair rule", () => {
  it("rejects a PARENT trying to start a conversation with another PARENT", async () => {
    const token = tokenFor("parent_1", "PARENT");
    prismaMock.user.findUnique.mockResolvedValue({
      id: "parent_2",
      role: "PARENT",
    } as any);

    const res = await request(app)
      .post("/api/v1/conversations")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ participantIds: ["parent_2"] });

    expect(res.status).toBe(400);
    expect(prismaMock.conversation.create).not.toHaveBeenCalled();
  });

  it("allows a PARENT to start a conversation with a TEACHER", async () => {
    const token = tokenFor("parent_1", "PARENT");
    prismaMock.user.findUnique.mockResolvedValue({ id: "teacher_1", role: "TEACHER" } as any);
    prismaMock.conversation.findFirst.mockResolvedValue(null);
    prismaMock.conversation.create.mockResolvedValue({
      id: "conv_1",
      subject: null,
      participants: [],
    } as any);

    const res = await request(app)
      .post("/api/v1/conversations")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ participantIds: ["teacher_1"] });

    expect(res.status).toBe(201);
    expect(prismaMock.conversation.create).toHaveBeenCalledTimes(1);
  });

  it("allows an ADMIN to start a conversation with a TEACHER", async () => {
    const token = tokenFor("admin_1", "ADMIN");
    prismaMock.user.findUnique.mockResolvedValue({ id: "teacher_1", role: "TEACHER" } as any);
    prismaMock.conversation.findFirst.mockResolvedValue(null);
    prismaMock.conversation.create.mockResolvedValue({ id: "conv_2", subject: null, participants: [] } as any);

    const res = await request(app)
      .post("/api/v1/conversations")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ participantIds: ["teacher_1"] });

    expect(res.status).toBe(201);
  });

  it("rejects a TEACHER trying to start a conversation with another TEACHER", async () => {
    const token = tokenFor("teacher_1", "TEACHER");
    prismaMock.user.findUnique.mockResolvedValue({ id: "teacher_2", role: "TEACHER" } as any);

    const res = await request(app)
      .post("/api/v1/conversations")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ participantIds: ["teacher_2"] });

    expect(res.status).toBe(400);
    expect(prismaMock.conversation.create).not.toHaveBeenCalled();
  });

  it("returns 404 when the other participant does not exist", async () => {
    const token = tokenFor("parent_1", "PARENT");
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/conversations")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ participantIds: ["ghost"] });

    expect(res.status).toBe(404);
  });
});

describe("POST /api/v1/conversations/:id/read - read receipts", () => {
  it("marks a message read: updates lastReadMessageId and upserts a ReadReceipt", async () => {
    const token = tokenFor("parent_1", "PARENT");
    prismaMock.conversationParticipant.update.mockResolvedValue({} as any);
    prismaMock.readReceipt.upsert.mockResolvedValue({} as any);

    const res = await request(app)
      .post("/api/v1/conversations/conv_1/read")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ messageId: "msg_1" });

    expect(res.status).toBe(200);
    expect(prismaMock.conversationParticipant.update).toHaveBeenCalledWith({
      where: { conversationId_userId: { conversationId: "conv_1", userId: "parent_1" } },
      data: { lastReadMessageId: "msg_1" },
    });
    expect(prismaMock.readReceipt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { messageId_userId: { messageId: "msg_1", userId: "parent_1" } },
      })
    );
  });

  it("returns 401 without auth", async () => {
    const res = await request(app)
      .post("/api/v1/conversations/conv_1/read")
      .set("Cookie", cookies())
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ messageId: "msg_1" });
    expect(res.status).toBe(401);
  });
});
