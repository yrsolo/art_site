import { getDisplayArtworks } from "@/data/public-site";

export function listPublicArtworks() {
  return getDisplayArtworks();
}

export function getPublicArtworkBySlug(slug: string) {
  return listPublicArtworks().find((artwork) => artwork.slug === slug) ?? null;
}
