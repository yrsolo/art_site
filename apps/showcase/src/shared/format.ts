import type { Artwork } from "@/features/artworks/types";

export function artworkMeta(artwork: Artwork) {
  return `${artwork.year} / ${artwork.medium} / ${artwork.size}`;
}

export function artworkPriceLabel(artwork: Artwork) {
  if (!artwork.price.trim()) {
    return "По запросу";
  }

  return artwork.currency.trim() ? `${artwork.price} ${artwork.currency}` : artwork.price;
}

export function statusLabel(status: Artwork["status"]) {
  switch (status) {
    case "for_sale":
      return "Продаётся";
    case "sold":
      return "Продана";
    case "off_market":
      return "Снята с продажи";
    case "in_progress":
      return "В процессе";
    default:
      return status;
  }
}
