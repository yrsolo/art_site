import { notFound } from "next/navigation";

import { VariantRouteClient } from "@/components/public/variant-route-client";
import { getDisplayArtworks, getEmbeddedPublicSiteSnapshot } from "@/data/public-site";
import { listVariants, getVariantOrThrow } from "@/features/variants";

export function generateStaticParams() {
  const artworks = getDisplayArtworks(getEmbeddedPublicSiteSnapshot());
  return listVariants()
    .filter((variant) => variant.supportedRoutes.includes("detail"))
    .flatMap((variant) => artworks.map((artwork) => ({ variant: variant.id, slug: artwork.slug })));
}

export default async function VariantArtworkPage({ params }: { params: Promise<{ variant: string; slug: string }> }) {
  const { variant, slug } = await params;
  const { manifest } = getVariantOrThrow(variant);

  if (!manifest.supportedRoutes.includes("detail")) {
    notFound();
  }

  return <VariantRouteClient variantId={variant} route="detail" slug={slug} />;
}
