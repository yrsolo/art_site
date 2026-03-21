import { notFound } from "next/navigation";

import { getSnapshotVariantContent } from "@/data/public-site";
import { variantContent } from "@/features/variants/content";
import { defaultVariantId, getVariantManifest, variantManifests } from "@/features/variants/manifests";
import type { VariantRouteKey } from "@/features/variants/types";

export function listVariants() {
  return variantManifests;
}

export function getVariantOrThrow(variantId: string) {
  const manifest = getVariantManifest(variantId);
  const content = getSnapshotVariantContent()[variantId] ?? variantContent[variantId];

  if (!manifest || !content) {
    notFound();
  }

  return {
    manifest,
    content,
  };
}

export function getDefaultVariant() {
  return getVariantOrThrow(defaultVariantId);
}

export function assertVariantSupportsRoute(route: VariantRouteKey, supportedRoutes: VariantRouteKey[]) {
  if (!supportedRoutes.includes(route)) {
    notFound();
  }
}
