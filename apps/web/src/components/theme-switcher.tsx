"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { siteThemes } from "@/features/themes/themes";
import type { ThemeId } from "@/features/themes/types";

type ThemeSwitcherProps = {
  currentThemeId: ThemeId;
};

export function ThemeSwitcher({ currentThemeId }: ThemeSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function applyTheme(themeId: ThemeId) {
    startTransition(() => {
      void fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ themeId }),
      }).then(() => {
        router.refresh();
      });
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {siteThemes.map((theme) => {
        const active = currentThemeId === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => applyTheme(theme.id)}
            disabled={isPending && active}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition ${
              active
                ? "border-current bg-black/10"
                : "border-current/20 opacity-70 hover:opacity-100"
            } ${isPending && active ? "cursor-wait" : ""}`}
          >
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
