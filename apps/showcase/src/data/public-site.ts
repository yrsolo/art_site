import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import artworksJson from "@/data/artworks.json";
import { variantContent as fallbackVariantContent } from "@/features/variants/content";
import type { Artwork, ArtworkPhoto } from "@/features/artworks/types";

type SnapshotArtwork = {
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
  showInGallery: boolean;
  description: string;
  photos: Array<{
    id: string;
    urlOriginal: string;
    urlPreview: string;
  }>;
  primaryPhotoId: string | null;
  sortOrder: number;
};

type PublicSiteSnapshot = {
  generatedAt: string;
  artworks: SnapshotArtwork[];
  variantContent: typeof fallbackVariantContent;
};

const generatedSnapshotPath = path.join(process.cwd(), "src", "generated", "public-site.json");

function mapSnapshotArtwork(artwork: SnapshotArtwork): Artwork {
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
    photos,
    primaryPhotoId: artwork.primaryPhotoId,
    imageOriginal: primaryPhoto.urlOriginal,
    imagePreview: primaryPhoto.urlPreview,
    order: artwork.sortOrder,
  };
}

function normalizeFallbackStatus(status: string): SnapshotArtwork["status"] {
  if (status === "sold") {
    return "sold";
  }

  if (status === "hidden") {
    return "off_market";
  }

  return "for_sale";
}

function buildFallbackSnapshot(): PublicSiteSnapshot {
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
    generatedAt: new Date().toISOString(),
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
  };
}

function readGeneratedSnapshot() {
  if (!existsSync(generatedSnapshotPath)) {
    return null;
  }

  try {
    const raw = readFileSync(generatedSnapshotPath, "utf8");
    return JSON.parse(raw) as PublicSiteSnapshot;
  } catch {
    return null;
  }
}

export function getPublicSiteSnapshot() {
  return readGeneratedSnapshot() ?? buildFallbackSnapshot();
}

export function getDisplayArtworks() {
  return getPublicSiteSnapshot()
    .artworks.filter((artwork) => artwork.showInGallery)
    .map(mapSnapshotArtwork)
    .sort((left, right) => left.order - right.order);
}

export function getSnapshotVariantContent() {
  return getPublicSiteSnapshot().variantContent;
}
