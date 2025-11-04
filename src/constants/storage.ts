import { getSession } from "@/utils/session"

const session = getSession()

export const CHAT_STORAGE_KEY = `chats_${session?.id || "guest"}`
export const TOKEN_STORAGE_KEY = `tokens_${session?.id || "guest"}`