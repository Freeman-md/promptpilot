import { AIMode, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type ChatState = {
  messages: Message[];
  currentChatId: string | null;
  mode: AIMode;
  isStreaming: boolean;

  startChat: () => void;
  addUserMessage: (text: string) => void;
  startStreaming: () => void;
  updateStreamMessage: (contentChunk: string) => void;
  endStreaming: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentChatId: uuidv4(),
  mode: {
    title: "Friendly",
    subtitle: "Warm and conversational",
  },
  isStreaming: false,

  startChat: () =>
    set(() => ({
      messages: [],
      currentChatId: uuidv4(),
      isStreaming: false,
    })),

  addUserMessage: (text) => {
    const { currentChatId } = get();
    const message: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      isStreaming: false,
      chatId: currentChatId!,
    };

    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  startStreaming: () =>
    set({
      isStreaming: true,
    }),

  updateStreamMessage: (contentChunk) => {
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content += contentChunk;
      } else {
        messages.push({
          id: uuidv4(),
          role: "assistant",
          content: contentChunk,
          createdAt: Date.now(),
          isStreaming: true,
          chatId: state.currentChatId!,
        });
      }

      return { messages };
    });
  },

  endStreaming: () =>
    set((state) => ({
      isStreaming: false,
      messages: state.messages.map((message) =>
        message.role === "assistant" ? { ...message, isStreaming: false } : message
      ),
    })),
}));
