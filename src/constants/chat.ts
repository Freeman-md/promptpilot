import { AIMode } from "@/types";

export const SESSION_KEY = "promptpilot_session";
export const ENCRYPTION_KEY = "promptpilot_demo_key"

export const TOKEN_LIMIT = 15000;

export const DEFAULT_AI_MODES: AIMode[] = [
  { title: "Friendly", subtitle: "Warm and conversational" },
  { title: "Technical", subtitle: "Precise and detailed" },
  { title: "Creative", subtitle: "Imaginative and inspiring" },
];

export const DEFAULT_MODE = DEFAULT_AI_MODES[0];