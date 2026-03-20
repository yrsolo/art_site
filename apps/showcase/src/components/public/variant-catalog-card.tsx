import Link from "next/link";

import type { VariantManifest } from "@/features/variants/types";

type VariantCatalogCardProps = {
  variant: VariantManifest;
};

export function VariantCatalogCard({ variant }: VariantCatalogCardProps) {
  return (
    <article className={`flex h-full flex-col justify-between gap-6 p-6 ${variant.classes.card} ${variant.classes.pill}`}>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] opacity-70">{variant.family.replace("_", " ")}</p>
          <h2 className="text-3xl font-semibold">{variant.label}</h2>
          <p className={`text-sm ${variant.classes.subtle}`}>{variant.northStar}</p>
        </div>
        <p className="text-sm leading-7">{variant.summary}</p>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] opacity-70">Do not dilute</p>
          <ul className={`space-y-2 text-sm ${variant.classes.subtle}`}>
            {variant.doNotDilute.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${variant.id}`} className={`px-4 py-3 text-sm font-medium ${variant.classes.accent} ${variant.classes.pill}`}>
          Open variant
        </Link>
        <Link href={`/${variant.id}/gallery`} className={`border px-4 py-3 text-sm ${variant.classes.pill}`}>
          Open gallery
        </Link>
      </div>
    </article>
  );
}
