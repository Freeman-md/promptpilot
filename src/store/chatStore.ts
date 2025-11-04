import { CHAT_STORAGE_KEY, DEFAULT_AI_MODES, DEFAULT_MODE, TOKEN_LIMIT, TOKEN_STORAGE_KEY } from "@/constants";
import { Chat, ChatState, Message } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import {
  readChats,
  writeChats,
  readTokens,
  writeTokens,
  readCurrentChatId,
  writeCurrentChatId,
  findChatById
} from '@/utils/storage'

export const useChatStore = create<ChatState>((set, get) => {
  const initialChats = readChats();
  const initialCurrentId = readCurrentChatId() ?? (initialChats[0]?.id ?? uuidv4());
  if (!readCurrentChatId()) writeCurrentChatId(initialCurrentId);

  const initialMessages =
    initialChats.find((c) => c.id === initialCurrentId)?.messages ?? [];

  return {
    currentChatId: initialCurrentId,
    aiModes: DEFAULT_AI_MODES,
    activeAIMode: DEFAULT_MODE,
    isAwaitingAIResponse: false,
    currentAssistantMessageId: null,
    messages: initialMessages,
    tokensUsed: readTokens(),

    // Tokens
    incrementTokenCount: (tokens) => {
      set((state) => {
        const next = state.tokensUsed + tokens;
        writeTokens(next);
        return { tokensUsed: next };
      });
    },

    // Modes
    setActiveAIMode: (modeTitle) =>
      set((state) => {
        const found =
          state.aiModes.find((m) => m.title.toLowerCase() === modeTitle.toLowerCase()) ??
          DEFAULT_MODE;
        if (found.title === state.activeAIMode.title) return state;
        return { activeAIMode: found };
      }),
    resetActiveAIMode: () => set({ activeAIMode: DEFAULT_MODE }),

    // Chat lifecycle
    addUserMessage: (text) => {
      const { currentChatId, saveChat } = get();
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content: text,
        createdAt: Date.now(),
        isStreaming: false,
        chatId: currentChatId,
      };
      set((state) => {
        const nextMessages = [...state.messages, userMessage];
        saveChat(nextMessages);
        return { messages: nextMessages };
      });
      return userMessage;
    },

    removeMessage: (id) =>
      set((state) => {
        const nextMessages = state.messages.filter((m) => m.id !== id);
        if (nextMessages.length === state.messages.length) return {};

        get().saveChat(nextMessages);

        const updates: Partial<ChatState> = { messages: nextMessages };
        if (state.currentAssistantMessageId === id) {
          updates.currentAssistantMessageId = null;
          updates.isAwaitingAIResponse = false;
        }

        return updates;
      }),

    saveChat: (messages) => {
      const { currentChatId } = get();
      const chats = readChats();
      const index = chats.findIndex((c) => c.id === currentChatId);

      if (index === -1) {
        const newChat: Chat = {
          id: currentChatId,
          title: `Chat ${chats.length + 1}`,
          updatedAt: Date.now(),
          messages,
        };
        chats.unshift(newChat); // newest first
      } else {
        chats[index] = { ...chats[index], messages, updatedAt: Date.now() };
        // move updated chat to front
        const [updated] = chats.splice(index, 1);
        chats.unshift(updated);
      }

      writeChats(chats);
      writeCurrentChatId(currentChatId);
    },

    createNewChat: () => {
      const chats = readChats();
      if (chats.length >= 5) {
        throw new Error("You’ve reached the maximum of 5 demo chats.");
      }

      const newChatId = uuidv4();
      writeCurrentChatId(newChatId);

      set({
        currentChatId: newChatId,
        messages: [],
        isAwaitingAIResponse: false,
        currentAssistantMessageId: null,
      });

      get().saveChat([]);
    },

    getAllChats: () => {
      const chats = readChats();
      return chats.sort((a, b) => b.updatedAt - a.updatedAt);
    },

    changeChat: (chatId: string) => {
      const chat = findChatById(chatId)

      if (!chat) return;

      set({
        messages: chat.messages,
        currentChatId: chatId,
        currentAssistantMessageId: null,
        isAwaitingAIResponse: false,
      })
    },

    resetChatHistory: () => {
      // remove only chats, keep tokens
      localStorage.removeItem(CHAT_STORAGE_KEY);
      const newId = uuidv4();
      writeCurrentChatId(newId);

      set({
        messages: [],
        currentChatId: newId,
        isAwaitingAIResponse: false,
        currentAssistantMessageId: null,
      });
    },

    // Streaming
    beginAIResponseStream: () => {
      const { currentChatId, saveChat } = get();
      const placeholder: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "",
        createdAt: Date.now(),
        isStreaming: true,
        chatId: currentChatId,
      };

      set((state) => {
        const messages = [...state.messages, placeholder];
        saveChat(messages);
        return {
          messages,
          isAwaitingAIResponse: true,
          currentAssistantMessageId: placeholder.id,
        };
      });
    },

    appendAIResponseChunk: (chunk) =>
      set((state) => {
        const targetId = state.currentAssistantMessageId;
        if (!targetId) return {};

        let updated = false;
        const messages = state.messages.map((message) => {
          if (message.id !== targetId) return message;

          updated = true;
          return {
            ...message,
            content: message.content + chunk,
          };
        });

        if (!updated) return {};

        get().saveChat(messages);
        return { messages };
      }),

    finalizeAIResponseStream: () =>
      set((state) => {
        const targetId = state.currentAssistantMessageId;
        let updated = false;

        const messages = state.messages.map((message) => {
          if (targetId) {
            if (message.id !== targetId || !message.isStreaming) return message;
            updated = true;
            return { ...message, isStreaming: false };
          }

          if (
            message.role === "assistant" &&
            message.isStreaming &&
            message.chatId === state.currentChatId
          ) {
            updated = true;
            return { ...message, isStreaming: false };
          }

          return message;
        });

        if (updated) {
          get().saveChat(messages);
          return {
            messages,
            isAwaitingAIResponse: false,
            currentAssistantMessageId: null,
          };
        }

        return { isAwaitingAIResponse: false, currentAssistantMessageId: null };
      }),

    // Send
    sendMessage: async (text) => {
      const {
        addUserMessage,
        removeMessage,
        incrementTokenCount,
        beginAIResponseStream,
        appendAIResponseChunk,
        finalizeAIResponseStream,
        activeAIMode,
      } = get();

      if (get().isAwaitingAIResponse) return;
      if (get().tokensUsed >= TOKEN_LIMIT) {
        throw new Error("Token limit reached — demo complete.");
      }

      const userMessage = addUserMessage(text);
      beginAIResponseStream();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            mode: activeAIMode,
            history: get().messages,
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("Stream reader not available.");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (get().tokensUsed >= TOKEN_LIMIT) break;

          const chunk = decoder.decode(value);

          // crude usage envelope detection (matches your server format)
          if (chunk.includes('"type":"usage"')) {
            try {
              const payload = JSON.parse(chunk.trim());
              const tokens = payload?.usage?.total_tokens ?? 0;
              if (tokens) incrementTokenCount(tokens);
              continue;
            } catch {
              // fall through to append if not JSON
            }
          }

          appendAIResponseChunk(chunk);
        }
      } catch (err) {
        removeMessage(userMessage.id);
        const streamingId = get().currentAssistantMessageId;
        if (streamingId) removeMessage(streamingId);
        if (err instanceof Error) throw new Error(err.message || "Failed to send message.");
        throw err;
      } finally {
        finalizeAIResponseStream();
      }
    },
  };
});
