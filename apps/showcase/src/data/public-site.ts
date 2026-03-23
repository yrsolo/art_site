import artworksJson from "@/data/artworks.json";
import generatedSnapshotJson from "@/generated/public-site.json";
import type { Artwork, ArtworkPhoto } from "@/features/artworks/types";
import { variantContent as fallbackVariantContent } from "@/features/variants/content";
import { variantSiteAssets as fallbackVariantSiteAssets } from "@/features/variants/site-assets";
import type { VariantContent, VariantSiteAssets } from "@/features/variants/types";

export type SnapshotArtwork = {
  id: string;
  slug: string;
  title: string;
  series: string;
  year: string;
  materials: string;
  size: string;
  price: string;
  currency: string;
  status: "for_sale" | "sold" | "off_market" | "in_progress";
  isArchived: boolean;
  showInGallery: boolean;
  description: string;
  photos: Array<{
    id: string;
    urlOriginal: string;
    urlPreview: string;
    alt?: string;
    caption?: string;
  }>;
  primaryPhotoId: string | null;
  sortOrder: number;
};

export type PublicSiteSnapshot = {
  schemaVersion: number;
  revision: string;
  generatedAt: string;
  publishedAt: string;
  artworks: SnapshotArtwork[];
  variantContent: Record<string, VariantContent>;
  variantSiteAssets: Record<string, VariantSiteAssets>;
};

export const publicSnapshotUrl =
  process.env.NEXT_PUBLIC_PUBLIC_SNAPSHOT_URL ??
  "https://storage.yandexcloud.net/art.solofarm.ru/data/public-site.json";

function normalizeFallbackStatus(status: string): SnapshotArtwork["status"] {
  if (status === "sold") {
    return "sold";
  }

  if (status === "hidden") {
    return "off_market";
  }

  return "for_sale";
}

function fallbackSnapshot(): PublicSiteSnapshot {
  const fallbackArtworks = artworksJson as Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    year: string;
    size: string;
    medium: string;
    status: string;
    imageOriginal: string;
    imagePreview: string;
    order: number;
    series?: string;
    price?: string;
    currency?: string;
  }>;

  return {
    schemaVersion: 2,
    revision: "embedded-fallback",
    generatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    artworks: fallbackArtworks.map((artwork) => ({
      id: artwork.id,
      slug: artwork.slug,
      title: artwork.title,
      series: artwork.series ?? "",
      year: artwork.year,
      materials: artwork.medium,
      size: artwork.size,
      price: artwork.price ?? "",
      currency: artwork.currency ?? "RUB",
      status: normalizeFallbackStatus(artwork.status),
      isArchived: false,
      showInGallery: artwork.status !== "hidden",
      description: artwork.description,
      photos: [
        {
          id: `${artwork.id}-primary`,
          urlOriginal: artwork.imageOriginal,
          urlPreview: artwork.imagePreview,
        },
      ],
      primaryPhotoId: `${artwork.id}-primary`,
      sortOrder: artwork.order,
    })),
    variantContent: fallbackVariantContent,
    variantSiteAssets: fallbackVariantSiteAssets,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizePublicSiteSnapshot(value: unknown): PublicSiteSnapshot {
  const fallback = fallbackSnapshot();

  if (!isObject(value)) {
    return fallback;
  }

  const candidate = isObject(value.snapshot) ? value.snapshot : value;

  return {
    schemaVersion: typeof candidate.schemaVersion === "number" ? candidate.schemaVersion : fallback.schemaVersion,
    revision: typeof candidate.revision === "string" ? candidate.revision : fallback.revision,
    generatedAt: typeof candidate.generatedAt === "string" ? candidate.generatedAt : fallback.generatedAt,
    publishedAt: typeof candidate.publishedAt === "string" ? candidate.publishedAt : fallback.generatedAt,
    artworks: Array.isArray(candidate.artworks) ? (candidate.artworks as SnapshotArtwork[]) : fallback.artworks,
    variantContent: isObject(candidate.variantContent)
      ? (candidate.variantContent as Record<string, VariantContent>)
      : fallback.variantContent,
    variantSiteAssets: isObject(candidate.variantSiteAssets)
      ? (candidate.variantSiteAssets as Record<string, VariantSiteAssets>)
      : fallback.variantSiteAssets,
  };
}

export function getEmbeddedPublicSiteSnapshot() {
  return normalizePublicSiteSnapshot(generatedSnapshotJson);
}

export function mapSnapshotArtwork(artwork: SnapshotArtwork): Artwork {
  const photos: ArtworkPhoto[] =
    artwork.photos.length > 0
      ? artwork.photos.map((photo) => ({
          id: photo.id,
          urlOriginal: photo.urlOriginal,
          urlPreview: photo.urlPreview,
        }))
      : [
          {
            id: `${artwork.id}-fallback`,
            urlOriginal: "/uploads/placeholder-dawn.svg",
            urlPreview: "/uploads/placeholder-dawn.svg",
          },
        ];

  const primaryPhoto =
    photos.find((photo) => photo.id === artwork.primaryPhotoId) ??
    photos[0];

  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    series: artwork.series,
    description: artwork.description,
    year: artwork.year,
    size: artwork.size,
    medium: artwork.materials,
    price: artwork.price,
    currency: artwork.currency,
    status: artwork.status,
    isArchived: Boolean(artwork.isArchived),
    photos,
    primaryPhotoId: artwork.primaryPhotoId,
    imageOriginal: primaryPhoto.urlOriginal,
    imagePreview: primaryPhoto.urlPreview,
    order: artwork.sortOrder,
  };
}

export function getDisplayArtworks(snapshot: PublicSiteSnapshot) {
  return snapshot.artworks
    .filter((artwork) => artwork.showInGallery)
    .filter((artwork) => !artwork.isArchived)
    .map(mapSnapshotArtwork)
    .sort((left, right) => left.order - right.order);
}

export function getPublicArtworkBySlug(snapshot: PublicSiteSnapshot, slug: string) {
  return getDisplayArtworks(snapshot).find((artwork) => artwork.slug === slug) ?? null;
}

export function getSnapshotVariantContent(snapshot: PublicSiteSnapshot, variantId: string) {
  return snapshot.variantContent[variantId] ?? fallbackVariantContent[variantId];
}

export function getSnapshotVariantSiteAssets(snapshot: PublicSiteSnapshot, variantId: string) {
  return snapshot.variantSiteAssets[variantId] ?? fallbackVariantSiteAssets[variantId];
}
