import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-robot-text",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "PromptPilot",
  description: "Created By Freeman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} ${spaceGrotesk.variable} antialiased flex`}
      >
        <Sidebar width="w-1/4" />

        <div>
          <header>This is the header</header>

          <main>This is the main component</main>

          <footer>This is the footer</footer>
        </div>
      </body>
    </html>
  );
}
