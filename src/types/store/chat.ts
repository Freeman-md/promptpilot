// src/types/store/chat.ts
import { AIMode, Chat, Message } from "@/types";

export type ChatState = {
  messages: Message[];
  currentChatId: string;
  aiModes: AIMode[];
  activeAIMode: AIMode;
  isAwaitingAIResponse: boolean;
  tokensUsed: number;
  currentAssistantMessageId: string | null;

  incrementTokenCount: (tokens: number) => void;
  resetTokenCount: () => void;

  setActiveAIMode: (modeTitle: string) => void;
  resetActiveAIMode: () => void;

  addUserMessage: (text: string) => Message;
  removeMessage: (id: string) => void;
  saveChat: (messages: Message[]) => void;
  createNewChat: () => void;
  changeChat: (chatId: string) => void;
  getAllChats: () => Chat[];
  resetChatHistory: () => void;
  resetAllSessionData: () => void;

  beginAIResponseStream: () => void;
  appendAIResponseChunk: (chunk: string) => void;
  finalizeAIResponseStream: () => void;

  sendMessage: (text: string) => void;
};
