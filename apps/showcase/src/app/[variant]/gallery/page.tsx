import { notFound } from "next/navigation";

import { VariantRouteClient } from "@/components/public/variant-route-client";
import { getVariantManifest, variantManifests } from "@/features/variants/manifests";

export function generateStaticParams() {
  return variantManifests.filter((variant) => variant.supportedRoutes.includes("gallery")).map((variant) => ({ variant: variant.id }));
}

export default async function VariantGalleryPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;

  if (!getVariantManifest(variant)) {
    notFound();
  }

  return <VariantRouteClient variantId={variant} route="gallery" />;
}
