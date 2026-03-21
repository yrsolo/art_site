"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import type { SessionState } from "@/lib/types";

const navigation = [
  { href: "/artworks", label: "Лоты" },
  { href: "/content", label: "Тексты" },
  { href: "/settings", label: "Настройки" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    apiFetch<SessionState>("/api/auth/session")
      .then((nextSession) => {
        if (!nextSession.authenticated) {
          router.replace("/login");
          return;
        }

        setSession(nextSession);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (!session?.authenticated) {
    return <main className="admin-loading">Проверяем сессию…</main>;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-kicker">ART_SITE</p>
          <h1>Admin</h1>
          <p className="admin-muted">Спокойная рабочая панель для лотов, текстов и публикации.</p>
        </div>

        <nav className="admin-nav">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
        </nav>

        {session.passwordIsDefault ? (
          <div className="admin-banner">
            Пароль всё ещё стандартный `333`. Это не мешает работе, но его стоит сменить.
          </div>
        ) : null}
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  );
}
