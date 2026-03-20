import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import type { SiteTheme, ThemeId } from "@/features/themes/types";

type SiteShellProps = {
  children: ReactNode;
  hero?: ReactNode;
  theme: SiteTheme;
  currentPath: string;
  currentThemeId: ThemeId;
};

export function SiteShell({
  children,
  hero,
  theme,
  currentPath,
  currentThemeId,
}: SiteShellProps) {
  return (
    <div className={`min-h-screen ${theme.bodyClassName}`}>
      <SiteHeader theme={theme} currentPath={currentPath} currentThemeId={currentThemeId} />
      {hero ? <section className={`border-b border-black/10 ${theme.heroClassName}`}>{hero}</section> : null}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">{children}</main>
    </div>
  );
}
