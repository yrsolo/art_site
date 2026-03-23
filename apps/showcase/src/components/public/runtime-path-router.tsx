"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "@/components/public/showcase-link";
import { VariantCatalogPage } from "@/components/public/variant-catalog-page";
import { VariantRouteClient } from "@/components/public/variant-route-client";
import { variantManifests } from "@/features/variants/manifests";

type ParsedRoute =
  | { kind: "catalog" }
  | { kind: "variant"; variantId: string; route: "home" | "gallery" | "about" | "contacts" }
  | { kind: "detail"; variantId: string; route: "detail"; slug: string }
  | { kind: "not-found" };

function readPathname() {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname || "/";
}

function parsePath(pathname: string): ParsedRoute {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/") {
    return { kind: "catalog" };
  }

  const segments = normalized.split("/").filter(Boolean);
  const [variantId, second, third] = segments;
  const manifest = variantManifests.find((entry) => entry.id === variantId);

  if (!manifest) {
    return { kind: "not-found" };
  }

  if (segments.length === 1) {
    return { kind: "variant", variantId, route: "home" };
  }

  if (segments.length === 2 && (second === "gallery" || second === "about" || second === "contacts")) {
    return { kind: "variant", variantId, route: second };
  }

  if (segments.length === 3 && second === "artwork" && third) {
    return { kind: "detail", variantId, route: "detail", slug: third };
  }

  return { kind: "not-found" };
}

export function RuntimePathRouter() {
  const [pathname, setPathname] = useState(readPathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setPathname(readPathname());
    setMounted(true);
    window.addEventListener("popstate", sync);
    window.addEventListener("showcase:navigate", sync);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("showcase:navigate", sync);
    };
  }, []);

  const parsed = useMemo(() => parsePath(pathname), [pathname]);

  if (!mounted) {
    return <main className="min-h-screen bg-[#f2eee7] text-[#1e1c18]" suppressHydrationWarning />;
  }

  if (parsed.kind === "catalog") {
    return <VariantCatalogPage />;
  }

  if (parsed.kind === "not-found") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1017] px-6 text-center text-white">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-white/50">Маршрут не найден</p>
          <p className="max-w-md text-sm text-white/70">
            Этот путь не распознан shell-роутером витрины. Вернитесь в каталог вариантов и откройте нужный эскиз заново.
          </p>
          <Link href="/" className="inline-flex border border-white/20 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/80">
            Вернуться в каталог
          </Link>
        </div>
      </main>
    );
  }

  return <VariantRouteClient variantId={parsed.variantId} route={parsed.route} slug={"slug" in parsed ? parsed.slug : undefined} />;
}
