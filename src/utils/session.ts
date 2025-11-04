import { ENCRYPTION_KEY, SESSION_KEY } from "@/constants";
import { SessionData } from "@/types";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";


export function getOrCreateSession(): SessionData {
    if (typeof window === "undefined") return { id: "", createdAt: 0 };

    const existingCipher = localStorage.getItem(SESSION_KEY)

    if (existingCipher) {
        try {
            const bytes = CryptoJS.AES.decrypt(existingCipher, ENCRYPTION_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (decrypted) return JSON.parse(decrypted) as SessionData;
        } catch {
            // Fallback if corrupted
            localStorage.removeItem(SESSION_KEY);
        }
    }

    // Create new session
  const newSession: SessionData = {
    id: uuidv4(),
    createdAt: Date.now(),
  };

  const cipher = CryptoJS.AES.encrypt(
    JSON.stringify(newSession),
    ENCRYPTION_KEY
  ).toString();

  localStorage.setItem(SESSION_KEY, cipher);
  return newSession;
}

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  const cipher = localStorage.getItem(SESSION_KEY);
  if (!cipher) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? (JSON.parse(decrypted) as SessionData) : null;
  } catch {
    return null;
  }
}

export function resetSession() {
  localStorage.removeItem(SESSION_KEY);
  window.location.reload();
}
