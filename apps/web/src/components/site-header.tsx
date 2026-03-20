import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import type { SiteTheme, ThemeId } from "@/features/themes/types";

type SiteHeaderProps = {
  theme: SiteTheme;
  currentPath: string;
  currentThemeId: ThemeId;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contacts", label: "Contacts" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader({ theme, currentPath, currentThemeId }: SiteHeaderProps) {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link href="/" className="text-xl font-semibold uppercase tracking-[0.2em]">
            Solo Farm Art
          </Link>
          <p className={`max-w-xl text-sm ${theme.subtleClassName}`}>
            Local MVP for a painter portfolio with gallery pages, artwork details, and a simple private admin.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <ThemeSwitcher currentThemeId={currentThemeId} redirectTo={currentPath} />
          <nav className="flex flex-wrap gap-4 text-sm">
            {navItems.map((item) => {
              const active = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "font-semibold underline decoration-2 underline-offset-4" : "opacity-80 hover:opacity-100"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
