import type { Metadata, Viewport } from "next";
import { Lexend, Source_Sans_3, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// UI UX Pro Max "Corporate Trust" pairing — Lexend is specifically designed
// for reading proficiency (education-grade), Source Sans 3 for accessible body.
// Noto Sans Devanagari covers Hindi (HI locale) glyphs.
const lexend = Lexend({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SQL Learn — Master SQL from Zero to Expert",
  description:
    "A complete, free, browser-based SQL learning platform. 60 structured modules, 316 interactive practice tasks, real query validation, and industry-level projects — no signup, no servers, no payment.",
  keywords: ["SQL", "learn SQL", "SQLite", "practice queries", "SQL tutorial", "database"],
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.variable} ${sourceSans.variable} ${notoDevanagari.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
