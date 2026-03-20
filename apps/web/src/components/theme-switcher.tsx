import Link from "next/link";

import { siteThemes } from "@/features/themes/themes";
import type { ThemeId } from "@/features/themes/types";

type ThemeSwitcherProps = {
  currentThemeId: ThemeId;
  redirectTo?: string;
};

export function ThemeSwitcher({ currentThemeId, redirectTo = "/" }: ThemeSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {siteThemes.map((theme) => {
        const active = currentThemeId === theme.id;

        return (
          <Link
            key={theme.id}
            href={`/theme/${theme.id}?redirect=${encodeURIComponent(redirectTo)}`}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition ${
              active
                ? "border-current bg-black/10"
                : "border-current/20 opacity-70 hover:opacity-100"
            }`}
          >
            {theme.label}
          </Link>
        );
      })}
    </div>
  );
}
