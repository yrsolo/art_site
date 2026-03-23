import "@/app/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART_SITE Admin",
  description: "Static admin frontend for managing artworks, content versions, and settings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
