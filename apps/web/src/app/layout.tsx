import "@/app/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ART_SITE API",
  description: "Backend-only runtime for admin auth, content storage, uploads, and snapshot export.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
