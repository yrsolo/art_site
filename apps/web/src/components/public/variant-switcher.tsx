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
    <div className="flex flex-wrap items-center gap-2">
      {variants.map((variant) => {
        const active = variant.id === currentVariantId;
        const suffix = variant.supportedRoutes.includes(currentRoute) ? routeSuffix(currentRoute, slug) : "";

        return (
          <Link
            key={variant.id}
            href={`/${variant.id}${suffix}`}
            className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition ${
              active ? "border-current bg-black/10" : "border-current/20 opacity-75 hover:opacity-100"
            }`}
          >
            {variant.label}
          </Link>
        );
      })}
    </div>
  );
}
