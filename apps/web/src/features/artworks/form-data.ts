import { artworkStatuses, type ArtworkInput, type ArtworkStatus } from "@/features/artworks/types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: string): ArtworkStatus {
  return artworkStatuses.includes(value as ArtworkStatus)
    ? (value as ArtworkStatus)
    : "hidden";
}

function normalizeOrder(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseArtworkInput(formData: FormData): ArtworkInput {
  const slug = normalizeString(formData.get("slug"));

  if (!slugPattern.test(slug)) {
    throw new Error("Slug must contain lowercase letters, numbers, and hyphens only.");
  }

  const title = normalizeString(formData.get("title"));
  const description = normalizeString(formData.get("description"));
  const year = normalizeString(formData.get("year"));
  const size = normalizeString(formData.get("size"));
  const medium = normalizeString(formData.get("medium"));
  const status = normalizeStatus(normalizeString(formData.get("status")));
  const order = normalizeOrder(normalizeString(formData.get("order")));
  const imageOriginal = normalizeString(formData.get("imageOriginal"));
  const imagePreview = normalizeString(formData.get("imagePreview")) || imageOriginal;

  if (!title || !description || !year || !size || !medium || !imageOriginal) {
    throw new Error("All artwork fields are required.");
  }

  return {
    slug,
    title,
    description,
    year,
    size,
    medium,
    status,
    imageOriginal,
    imagePreview,
    order,
  };
}
