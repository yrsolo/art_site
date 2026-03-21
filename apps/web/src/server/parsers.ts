import type { ArtworkInput, ArtworkStatus } from "@/features/artworks/types";
import type { ContentPageKey, ContentVersionStatus } from "@/features/content/types";

const validArtworkStatuses = new Set<ArtworkStatus>(["for_sale", "sold", "off_market", "in_progress"]);
const validContentPageKeys = new Set<ContentPageKey>(["home", "gallery", "artwork", "about", "contacts"]);
const validContentStatuses = new Set<ContentVersionStatus>(["draft", "published", "archived"]);

export function parseArtworkInput(body: Record<string, unknown>): ArtworkInput {
  const status = String(body.status ?? "for_sale") as ArtworkStatus;

  if (!validArtworkStatuses.has(status)) {
    throw new Error("Invalid artwork status.");
  }

  return {
    slug: String(body.slug ?? ""),
    title: String(body.title ?? ""),
    series: String(body.series ?? ""),
    year: String(body.year ?? ""),
    materials: String(body.materials ?? ""),
    size: String(body.size ?? ""),
    price: String(body.price ?? ""),
    currency: String(body.currency ?? "RUB"),
    status,
    showInGallery: Boolean(body.showInGallery),
    description: String(body.description ?? ""),
    sortOrder: Number(body.sortOrder ?? 1),
  };
}

export function parseContentPageKey(value: unknown) {
  const pageKey = String(value ?? "") as ContentPageKey;

  if (!validContentPageKeys.has(pageKey)) {
    throw new Error("Invalid content page key.");
  }

  return pageKey;
}

export function parseContentStatus(value: unknown) {
  const status = String(value ?? "draft") as ContentVersionStatus;

  if (!validContentStatuses.has(status)) {
    throw new Error("Invalid content version status.");
  }

  return status;
}
