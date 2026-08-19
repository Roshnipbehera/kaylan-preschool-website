import { promises as fs } from "fs";
import path from "path";
import type { Conversation, Message } from "@/lib/types/messaging";

const DATA_DIR = path.join(process.cwd(), "data", "messaging");
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readConversations(): Promise<Conversation[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(CONVERSATIONS_FILE, "utf-8");
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export async function writeConversations(conversations: Conversation[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2), "utf-8");
}

export async function readMessages(): Promise<Message[]> {
  await ensureDir();
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

export async function writeMessages(messages: Message[]): Promise<void> {
  await ensureDir();
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
}
