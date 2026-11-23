import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tourney Hub — Premium Esports Tournament Platform",
  description:
    "Enter the arena. Compete with your squad, rise through the ranks, and claim your victory in community esports tournaments.",
  keywords: ["esports", "tournaments", "free fire", "squad", "gaming", "championship"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#080B11] text-[#F5F5F5] antialiased selection:bg-[#D6A83F]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
