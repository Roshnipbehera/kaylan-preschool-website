import { createConversationSchema, sendMessageSchema } from "../../src/validation/messaging";

// Re-declare the admissions/CMS create schemas' shapes are exercised at the
// API layer (tests/api/admissions.api.test.ts) since they're not exported
// from admissionController.ts. Here we cover the exported messaging schemas
// directly as pure-logic unit tests.
describe("validation/messaging schemas", () => {
  it("accepts a valid createConversation payload", () => {
    const result = createConversationSchema.safeParse({ participantIds: ["user_2"], subject: "Homework question" });
    expect(result.success).toBe(true);
  });

  it("rejects createConversation with no participants", () => {
    const result = createConversationSchema.safeParse({ participantIds: [] });
    expect(result.success).toBe(false);
  });

  it("rejects createConversation with more than one participant (1:1 only)", () => {
    const result = createConversationSchema.safeParse({ participantIds: ["a", "b"] });
    expect(result.success).toBe(false);
  });

  it("accepts a valid sendMessage payload", () => {
    const result = sendMessageSchema.safeParse({ conversationId: "c1", body: "Hello there" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty message body", () => {
    const result = sendMessageSchema.safeParse({ conversationId: "c1", body: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a message body over 5000 chars", () => {
    const result = sendMessageSchema.safeParse({ conversationId: "c1", body: "x".repeat(5001) });
    expect(result.success).toBe(false);
  });
});
