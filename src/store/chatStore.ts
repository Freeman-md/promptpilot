import { CHAT_STORAGE_KEY, DEFAULT_AI_MODES, DEFAULT_MODE, TOKEN_LIMIT, TOKEN_STORAGE_KEY } from "@/constants";
import { AIMode, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type ChatState = {
  messages: Message[];
  currentChatId: string;
  aiModes: AIMode[];
  activeAIMode: AIMode;
  isAwaitingAIResponse: boolean;
  tokensUsed: number;

  /** Tokens control */
  incrementTokenCount: (tokens: number) => void;
  resetTokenCount: () => void;

  /** Mode control */
  setActiveAIMode: (modeTitle: string) => void;
  resetActiveAIMode: () => void;

  /** Chat control */
  addUserMessage: (text: string) => Message;
  removeMessage: (id: string) => void;
  saveChats: (messages: Message[]) => void;
  resetChatHistory: () => void;
  resetAllSessionData: () => void;

  /** AI response streaming */
  beginAIResponseStream: () => void;
  appendAIResponseChunk: (chunk: string) => void;
  finalizeAIResponseStream: () => void;

  /** API communication */
  sendMessage: (text: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: uuidv4(),
  aiModes: DEFAULT_AI_MODES,
  activeAIMode: DEFAULT_MODE,
  isAwaitingAIResponse: false,
  messages: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "[]")
    : [],
  tokensUsed: typeof window !== "undefined"
    ? Number(localStorage.getItem(TOKEN_STORAGE_KEY)) || 0
    : 0,


  /** ─── Tokens Management ─────────────────────────────── */
  incrementTokenCount: (tokens: number) => {
    set((state) => {
      const updated = state.tokensUsed + tokens;
      localStorage.setItem(TOKEN_STORAGE_KEY, String(updated));

      return { tokensUsed: updated };
    });
  },
  resetTokenCount: () => set({ tokensUsed: 0 }),

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

  removeMessage: (id: string) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  saveChats: (messages: Message[]) => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  },
  resetChatHistory: () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    set({
      messages: [],
      currentChatId: uuidv4(),
      isAwaitingAIResponse: false,
    });
  },
  resetAllSessionData: () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({
      messages: [],
      tokensUsed: 0,
      currentChatId: uuidv4(),
      isAwaitingAIResponse: false,
    });
  },


  /** ─── AI Stream Handlers ───────────────────────────── */
  beginAIResponseStream: () => set({ isAwaitingAIResponse: true }),

  appendAIResponseChunk: (chunk) =>
    set((state) => {
      const { saveChats } = get()
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

      saveChats(messages)

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
      removeMessage,
      incrementTokenCount,
      beginAIResponseStream,
      appendAIResponseChunk,
      finalizeAIResponseStream,
      isAwaitingAIResponse,
      activeAIMode,
      messages,
      tokensUsed
    } = get();

    if (isAwaitingAIResponse) return;

    if (tokensUsed > TOKEN_LIMIT) throw new Error("Token limit reached - demo complete.")

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

      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Stream reader not available.");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (tokensUsed > TOKEN_LIMIT) throw new Error("Token limit reached mid-stream - demo complete.")

        const chunk = decoder.decode(value);

        if (chunk.includes('"type":"usage"')) {
          const parsed = JSON.parse(chunk.trim())
          const tokens = parsed.usage.total_tokens;

          incrementTokenCount(tokens)
          continue
        }

        appendAIResponseChunk(chunk);
      }

    } catch (err: unknown) {
      removeMessage(userMessage.id);


      if (err instanceof Error)
        throw new Error(err.message || "Failed to send message.");
    } finally {
      finalizeAIResponseStream();
    }
  },
}));
