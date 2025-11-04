export type AIMode = {
  title: "Friendly" | "Technical" | "Creative";
  subtitle?: string;
  icon?: React.ElementType;
};

export type Chat = {
    id: string;
    title: string;
    updatedAt: number;
    messages: Message[]
}

export type Message = {
  id: string;
  role: "user" | "assistant" | "system"
  content: string;
  createdAt: number;
  isStreaming: boolean;
  chatId: string;
}

export type SessionData = {
  id: string;
  createdAt: number;
}

export * from './store/chat'