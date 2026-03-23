"use client";

import Link from "@/components/public/showcase-link";

import { listVariants } from "@/features/variants";
import type { VariantRouteKey } from "@/features/variants/types";

type VariantSwitcherProps = {
  currentVariantId: string;
  currentRoute: VariantRouteKey;
  slug?: string;
};

function routeSuffix(route: VariantRouteKey, slug?: string) {
  switch (route) {
    case "home":
      return "";
    case "gallery":
      return "/gallery";
    case "about":
      return "/about";
    case "contacts":
      return "/contacts";
    case "detail":
      return slug ? `/artwork/${slug}` : "";
    default:
      return "";
  }
}

export function VariantSwitcher({ currentVariantId, currentRoute, slug }: VariantSwitcherProps) {
  const variants = listVariants();

  return (
    <div className="fixed right-6 top-1/2 z-[90] hidden -translate-y-1/2 xl:flex">
      <div className="flex min-w-[9.75rem] flex-col gap-2 rounded-[24px] border border-white/10 bg-[rgba(8,12,18,0.45)] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        {variants.map((variant) => {
          const active = variant.id === currentVariantId;
          const suffix = variant.supportedRoutes.includes(currentRoute) ? routeSuffix(currentRoute, slug) : "";

          return (
            <Link
              key={variant.id}
              href={`/${variant.id}${suffix}`}
              className={`border px-3 py-2 text-right text-[10px] uppercase tracking-[0.18em] transition ${
                active
                  ? "border-white/50 bg-[rgba(10,14,20,0.88)] text-white"
                  : "border-white/10 bg-[rgba(10,14,20,0.45)] text-white/70 hover:border-white/30 hover:text-white"
              }`}
            >
              {variant.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
