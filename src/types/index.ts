export type AIMode = {
  title: "Friendly" | "Technical" | "Creative";
  subtitle?: string;
  icon?: React.ElementType;
};

export type Chat = {
    title: string;
    relativeTime: string;
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