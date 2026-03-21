import { getDisplayArtworks, getEmbeddedPublicSiteSnapshot } from "@/data/public-site";

export function listPublicArtworks() {
  return getDisplayArtworks(getEmbeddedPublicSiteSnapshot());
}

export function getPublicArtworkBySlug(slug: string) {
  return listPublicArtworks().find((artwork) => artwork.slug === slug) ?? null;
}
