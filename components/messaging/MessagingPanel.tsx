"use client";

// Shared chat UI (conversation sidebar + bubble thread + composer), reused
// verbatim in look/feel from the previous JSON-mock TeacherMessagesContent /
// ParentMessagesContent, now backed by the live Zustand store
// (lib/messaging/store.ts) -> real backend REST + Socket.io instead of
// app/api/messaging/**. One component powers parent, teacher and admin
// messages pages so all three stay visually consistent.
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, MessageCircle, Circle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { useMessagingStore } from "@/lib/messaging/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const composeSchema = z.object({
  body: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});
type ComposeInput = z.infer<typeof composeSchema>;

const accentByRole: Record<string, string> = {
  parent: "bg-candy text-white",
  teacher: "bg-sky text-[#3a2e4d]",
  admin: "bg-lavender text-[#3a2e4d]",
};

export function MessagingPanel() {
  const { user, role } = useAuth();
  const toast = useToast();
  const accent = accentByRole[role ?? "parent"] ?? accentByRole.parent;

  const {
    conversations,
    activeConversationId,
    messagesByConversation,
    onlineUserIds,
    typingByConversation,
    connect,
    setActiveConversation,
    loadConversations,
    loadMessages,
    send,
    markConversationRead,
    startTyping,
    stopTyping,
  } = useMessagingStore();

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    // Mirrors the token AuthContext keeps in localStorage (kaylan_token) so
    // the Socket.io handshake can authenticate even though the real access
    // token cookie is httpOnly (see lib/auth/AuthContext.tsx).
    const token = typeof window !== "undefined" ? window.localStorage.getItem("kaylan_token") ?? undefined : undefined;
    connect(token);
    setLoadingConversations(true);
    loadConversations().finally(() => setLoadingConversations(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  useEffect(() => {
    if (!activeConversationId) return;
    setLoadingMessages(true);
    loadMessages(activeConversationId).finally(() => setLoadingMessages(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  const messages = messagesByConversation[activeConversationId ?? ""] ?? [];

  useEffect(() => {
    if (activeConversationId && messages.length > 0) {
      markConversationRead(activeConversationId).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, messages.length]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const otherParticipants = useMemo(
    () => activeConversation?.participants.filter((p) => p.id !== user?.id) ?? [],
    [activeConversation, user?.id]
  );
  const typingUsers = activeConversationId ? typingByConversation[activeConversationId] : undefined;
  const someoneTyping = otherParticipants.some((p) => typingUsers?.has(p.id));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ComposeInput>({ resolver: zodResolver(composeSchema) });

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTyping = () => {
    if (!activeConversationId) return;
    startTyping(activeConversationId);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => stopTyping(activeConversationId), 2000);
  };

  const onSubmit = async (values: ComposeInput) => {
    if (!activeConversationId) return;
    try {
      await send(activeConversationId, values.body);
      reset();
      if (activeConversationId) stopTyping(activeConversationId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    }
  };

  const conversationTitle = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    const others = conv?.participants.filter((p) => p.id !== user?.id) ?? [];
    return others.map((p) => p.name).join(", ") || conv?.subject || "Conversation";
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-[#3a2e4d]">Messages</h1>

      {loadingConversations ? (
        <Skeleton className="h-96 w-full" />
      ) : conversations.length === 0 ? (
        <Card>
          <p className="text-sm text-[#3a2e4d]/60">No conversations yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-[1fr_2fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {conversations.map((c) => {
                const others = c.participants.filter((p) => p.id !== user?.id);
                const isOnline = others.some((p) => onlineUserIds.has(p.id));
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConversation(c.id)}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-heading transition-colors ${
                      c.id === activeConversationId ? accent : "bg-[#faf9ff] text-[#3a2e4d] hover:bg-black/5"
                    }`}
                  >
                    <MessageCircle size={16} />
                    <span className="flex-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        {others.map((p) => p.name).join(", ") || c.subject || "Conversation"}
                        {isOnline && <Circle size={8} className="fill-green-400 text-green-400" />}
                      </span>
                      <span className="block text-xs opacity-70">{c.lastMessage?.body ?? "No messages yet"}</span>
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{c.unreadCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>{activeConversationId ? conversationTitle(activeConversationId) : "Select a conversation"}</CardTitle>
            </CardHeader>

            {loadingMessages ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="mb-4 flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-xl bg-[#faf9ff] p-4">
                {messages.length === 0 ? (
                  <p className="text-sm text-[#3a2e4d]/60">No messages yet — say hello!</p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === user?.id;
                    return (
                      <div key={m.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? accent : "bg-white text-[#3a2e4d] shadow-sm"}`}>
                          <p>{m.isDeletedForEveryone ? <em className="opacity-70">Message deleted</em> : m.body}</p>
                          {m.attachments.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {m.attachments.map((a) => (
                                <li key={a.id}>
                                  <a
                                    href={a.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`text-xs underline ${mine ? "text-[#3a2e4d]" : "text-sky-700"}`}
                                  >
                                    {a.filename}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <span className="mt-1 text-[10px] text-[#3a2e4d]/40">
                          {m.sender?.name ?? "Unknown"} &middot; {new Date(m.createdAt).toLocaleString()}
                          {m.isEdited && " · edited"}
                        </span>
                      </div>
                    );
                  })
                )}
                {someoneTyping && <p className="text-xs italic text-[#3a2e4d]/50">Typing…</p>}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-2">
                <textarea
                  rows={2}
                  placeholder="Type a message…"
                  aria-label="Message"
                  className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] placeholder:text-[#3a2e4d]/40 focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                  {...register("body")}
                  onChange={(e) => {
                    register("body").onChange(e);
                    handleTyping();
                  }}
                />
                {errors.body && <p className="mt-1 text-xs font-semibold text-red-500">{errors.body.message}</p>}
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!activeConversationId}>
                  <Send size={14} className="mr-1" /> Send
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
