// src/utils/storage.ts
import { CHAT_STORAGE_KEY, TOKEN_STORAGE_KEY } from "@/constants";
import { Chat } from "@/types";

export const readChats = (): Chat[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CHAT_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Chat[]) : [];
};

export const writeChats = (chats: Chat[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
};

export const readTokens = (): number => {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
  return raw ? Number(raw) || 0 : 0;
};

export const writeTokens = (value: number) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, String(value));
};

export const readCurrentChatId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("currentChatId");
};

export const writeCurrentChatId = (id: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentChatId", id);
};

export const findChatById = (id: string) => {
  const chats = readChats()
  return chats.find(chat => chat.id === id)
}