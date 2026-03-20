import artworksJson from "@/data/artworks.json";
import type { Artwork } from "@/features/artworks/types";

const artworks = artworksJson as Artwork[];

export function listPublicArtworks() {
  return artworks.filter((artwork) => artwork.status !== "hidden").sort((a, b) => a.order - b.order);
}

export function getPublicArtworkBySlug(slug: string) {
  return listPublicArtworks().find((artwork) => artwork.slug === slug) ?? null;
}
