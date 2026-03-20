import Link from "next/link";

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
    <div className="fixed right-4 top-1/2 z-[70] hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      {variants.map((variant) => {
        const active = variant.id === currentVariantId;
        const suffix = variant.supportedRoutes.includes(currentRoute) ? routeSuffix(currentRoute, slug) : "";

        return (
          <Link
            key={variant.id}
            href={`/${variant.id}${suffix}`}
            className={`min-w-[10.5rem] border px-3 py-2 text-right text-[10px] uppercase tracking-[0.18em] shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition ${
              active
                ? "border-white/50 bg-[rgba(10,14,20,0.82)] text-white"
                : "border-white/15 bg-[rgba(10,14,20,0.55)] text-white/70 hover:border-white/35 hover:text-white"
            }`}
          >
            {variant.label}
          </Link>
        );
      })}
    </div>
  );
}
