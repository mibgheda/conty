import type { Metadata } from "next";
import { I18nProvider } from "@/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Conty — AI Content Assistant | Photo to Prompt",
  description:
    "Upload a photo and get a structured AI prompt broken into 9 categories: subject, composition, lighting, color, style, mood, background, textures, and quality.",
  keywords: [
    "AI prompt generator",
    "photo to prompt",
    "image to prompt",
    "structured prompt",
    "content assistant",
    "AI art prompt",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
