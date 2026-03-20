import type { ReactNode } from "react";
import Link from "next/link";

import type { VariantContent, VariantRouteKey } from "@/features/variants/types";
import type { VariantManifest } from "@/features/variants/types";

type VariantShellProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
  hero?: ReactNode;
};

export function VariantShell({
  manifest,
  content,
  currentRoute,
  children,
  hero,
}: VariantShellProps) {
  const basePath = `/${manifest.id}`;
  const navItems = [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "about" as const, href: `${basePath}/about`, label: content.nav.about },
    { key: "contacts" as const, href: `${basePath}/contacts`, label: content.nav.contacts },
  ];

  return (
    <div className={`min-h-screen ${manifest.classes.body}`}>
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <Link href="/" className="text-sm uppercase tracking-[0.28em] opacity-70">
              Variant Catalog
            </Link>
            <div className="space-y-1">
              <p className="text-2xl font-semibold">{manifest.label}</p>
              <p className={`max-w-2xl text-sm ${manifest.classes.subtle}`}>{manifest.summary}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-4 text-sm">
              {navItems
                .filter((item) => manifest.supportedRoutes.includes(item.key))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      currentRoute === item.key
                        ? "font-semibold underline decoration-2 underline-offset-4"
                        : "opacity-80 hover:opacity-100"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </header>

      {hero ? <section className={`border-b border-black/10 ${manifest.classes.hero}`}>{hero}</section> : null}

      <main className="mx-auto flex w-full max-w-7xl flex-col px-6 py-10">{children}</main>
    </div>
  );
}
