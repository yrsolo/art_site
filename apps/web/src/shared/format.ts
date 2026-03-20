import type { Artwork } from "@/features/artworks/types";

export function artworkMeta(artwork: Artwork) {
  return `${artwork.year} · ${artwork.medium} · ${artwork.size}`;
}

export function statusLabel(status: Artwork["status"]) {
  switch (status) {
    case "available":
      return "Available";
    case "sold":
      return "Sold";
    case "hidden":
      return "Hidden";
    default:
      return status;
  }
}
