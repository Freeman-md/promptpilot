import { AIMode, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

/** Define available modes outside the store so they’re not recreated on every hook call */
const DEFAULT_AI_MODES: AIMode[] = [
  { title: "Friendly", subtitle: "Warm and conversational" },
  { title: "Technical", subtitle: "Precise and detailed" },
  { title: "Creative", subtitle: "Imaginative and inspiring" },
];

const DEFAULT_MODE = DEFAULT_AI_MODES[0];

type ChatState = {
  messages: Message[];
  currentChatId: string;
  aiModes: AIMode[];
  activeAIMode: AIMode;
  isAwaitingAIResponse: boolean;

  /** Mode control */
  setActiveAIMode: (modeTitle: string) => void;
  resetActiveAIMode: () => void;

  /** Chat control */
  resetChatSession: () => void;
  addUserMessage: (text: string) => Message;

  /** AI response streaming */
  beginAIResponseStream: () => void;
  appendAIResponseChunk: (chunk: string) => void;
  finalizeAIResponseStream: () => void;

  /** API communication */
  sendMessage: (text: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentChatId: uuidv4(),
  aiModes: DEFAULT_AI_MODES,
  activeAIMode: DEFAULT_MODE,
  isAwaitingAIResponse: false,

  /** ─── Mode Management ─────────────────────────────── */
  setActiveAIMode: (modeTitle) =>
    set((state) => {
      const found =
        state.aiModes.find(
          (mode) => mode.title.toLowerCase() === modeTitle.toLowerCase()
        ) ?? DEFAULT_MODE;

      // Only update if different to prevent unnecessary renders
      if (found.title === state.activeAIMode.title) return state;
      return { activeAIMode: found };
    }),

  resetActiveAIMode: () => set({ activeAIMode: DEFAULT_MODE }),

  /** ─── Chat Lifecycle ──────────────────────────────── */
  resetChatSession: () =>
    set({
      messages: [],
      currentChatId: uuidv4(),
      isAwaitingAIResponse: false,
    }),

  addUserMessage: (text) => {
    const { currentChatId } = get();
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      createdAt: Date.now(),
      isStreaming: false,
      chatId: currentChatId,
    };
    set((state) => ({ messages: [...state.messages, userMessage] }));
    return userMessage;
  },

  /** ─── AI Stream Handlers ───────────────────────────── */
  beginAIResponseStream: () => set({ isAwaitingAIResponse: true }),

  appendAIResponseChunk: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];

      if (last?.role === "assistant") {
        last.content += chunk;
      } else {
        messages.push({
          id: uuidv4(),
          role: "assistant",
          content: chunk,
          createdAt: Date.now(),
          isStreaming: true,
          chatId: state.currentChatId,
        });
      }
      return { messages };
    }),

  finalizeAIResponseStream: () =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && last.isStreaming) {
        last.isStreaming = false;
      }
      return { messages, isAwaitingAIResponse: false };
    }),

  /** ─── Main Send Logic ─────────────────────────────── */
  sendMessage: async (text) => {
    const {
      addUserMessage,
      beginAIResponseStream,
      appendAIResponseChunk,
      finalizeAIResponseStream,
      isAwaitingAIResponse,
      activeAIMode,
      messages,
    } = get();

    if (isAwaitingAIResponse) return;

    const userMessage = addUserMessage(text);
    beginAIResponseStream();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          mode: activeAIMode,
          history: messages,
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Stream reader not available.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendAIResponseChunk(decoder.decode(value));
      }
    } catch (err) {
      console.error("Error streaming AI response:", err);
    } finally {
      finalizeAIResponseStream();
    }
  },
}));
