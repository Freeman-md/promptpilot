import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/layout/LayoutClient";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-robot-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://promptpilot-freemancodz.vercel.app"),
  title: {
    default: "PromptPilot – AI Chat Companion",
    template: "%s | PromptPilot",
  },
  description:
    "PromptPilot is a lightweight AI chat companion with streaming responses, tone-aware prompts, and token tracking powered by Next.js 15 and OpenAI.",
  keywords: [
    "PromptPilot",
    "AI chat",
    "OpenAI Responses API",
    "Next.js 15",
    "streaming AI responses",
    "Freeman Madudili",
  ],
  authors: [{ name: "Freeman Madudili", url: "https://freemanmadudili.com" }],
  creator: "Freeman Madudili",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PromptPilot – AI Chat Companion",
    description:
      "PromptPilot pairs streaming AI responses with tone-specific prompts, moderation guardrails, and local session persistence.",
    url: "https://promptpilot-freemancodz.vercel.app",
    siteName: "PromptPilot",
    images: [
      {
        url: "/homepage.png",
        width: 1600,
        height: 900,
        alt: "PromptPilot chat interface preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptPilot – AI Chat Companion",
    description:
      "Stream tone-aware AI conversations with PromptPilot, built by Freeman Madudili using Next.js 15 and the OpenAI Responses API.",
    images: ["/homepage.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${spaceGrotesk.variable} antialiased flex`}
      >
        <LayoutClient>{children}</LayoutClient>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
