# PromptPilot

PromptPilot is a lightweight AI ideation companion built with Next.js 15 and OpenAI’s Responses API. It pairs streaming chat responses with guardrails, local chat persistence, and per-session token accounting so you can explore conversational UX patterns without heavy infrastructure.

## Live Demo

- Web app: https://live-demo.example.com  
- Demo video / screenshots: _(add link or media when ready)_

> Tip: Drop a GIF or screenshot into `public/` and reference it here once you have visuals.

## Highlights

- **Multi-tone AI modes** – Friendly, Technical, and Creative prompts applied per request.
- **Streaming responses** – Uses the Responses API stream to render partial assistant output instantly.
- **Safety guardrails** – Client- and server-side validation plus OpenAI moderation checks.
- **Session persistence** – Locally encrypted session id scopes chat/tokens to a user.
- **Token budget tracking** – Enforces a configurable `TOKEN_LIMIT` with incremental usage updates.

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19 + TypeScript 5
- Tailwind CSS v4 with custom design tokens
- Zustand for client state management
- OpenAI Node SDK v6
- Sonner + next-themes for notifications and theming
- CryptoJS for local session encryption

## Architecture Overview

```
src/
├── app/               # Next.js app router pages & API handlers
│   ├── api/chat/      # Streaming Responses API endpoint
│   ├── layout.tsx     # Root layout, fonts, Toaster
│   └── page.tsx       # Chat surface + message list
├── components/        # UI building blocks
│   ├── chat/          # Message bubble + composer
│   ├── layout/        # Sidebar, header, footer shell
│   └── ui/            # Reusable UI primitives
├── constants/         # Shared configuration (modes, storage keys)
├── lib/               # Third-party clients (OpenAI)
├── store/             # Zustand state containers
├── types/             # Shared TypeScript contracts
└── utils/             # Helpers for storage, sessions, formatting
```

Key flows:

- **`src/app/api/chat/route.ts`** orchestrates validation, moderation, prompt selection, and streaming OpenAI responses back to the client.
- **`src/store/chatStore.ts`** controls chat sessions, handles streaming updates, and persists conversation/token data to `localStorage`.
- **`src/utils/session.ts`** encrypts a generated session id so storage keys are user-specific.

## Getting Started

### Prerequisites

- Node.js 20 LTS (or newer)
- npm 10+ (ships with modern Node)
- OpenAI API key with access to the Responses API

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/promptpilot.git
cd promptpilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local   # create this template if you want a starter
```

Then add:

```bash
OPENAI_API_KEY=sk-your-key-here
```

> The Responses API currently requires `gpt-5-mini`. Adjust the model in `src/app/api/chat/route.ts` if your account uses a different deployment.

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to start chatting.

### Production Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Core Concepts

- **AI Modes** – Defined in `src/constants/chat.ts`, each mode contributes a tailored system prompt that shapes the assistant’s tone.
- **Token Guardrails** – `TOKEN_LIMIT` caps how many tokens can be consumed per session; usage metadata is streamed from the server and tallied locally.
- **Local Persistence** – `localStorage` keeps chats and counters scoped via the encrypted session id so a single browser can iterate without a backend database.
- **Input Validation** – The client denies short/long or suspicious prompts, and the server re-validates plus runs OpenAI moderation for defense in depth.

## Deployment Notes

- Set `OPENAI_API_KEY` in your hosting provider’s environment configuration.
- Ensure the runtime supports Edge-friendly streams or fall back to Node handlers depending on your deployment target.
- Disable verbose `console.log` statements in production if you don’t want prompt/usage data in logs.

## Potential Enhancements

- Split chat/token logic into dedicated Zustand stores or state machines.
- Extract the streaming / envelope parsing logic into a shared utility module.
- Promote storage helpers to a service that supports server rendering or a database.
- Add optimistic fallbacks and retry logic around the Responses API call.
- Provide end-to-end tests (Playwright) covering mode switching and token limits.
- Support rich messages (markdown, code blocks) and message editing.
- Internationalize UI copy and date formatting helpers.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/amazing-improvement`.
3. Commit with clear messages and open a pull request describing the change.

Bug reports and improvement ideas are welcome via issues or discussions.

## License
This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

Made with curiosity and OpenAI’s streaming APIs. Have fun piloting your prompts!
