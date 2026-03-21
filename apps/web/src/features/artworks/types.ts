export const artworkStatuses = ["for_sale", "sold", "off_market", "in_progress"] as const;

export type ArtworkStatus = (typeof artworkStatuses)[number];

export type ArtworkPhoto = {
  id: string;
  storageKey: string;
  previewStorageKey: string;
  urlOriginal: string;
  urlPreview: string;
  alt: string;
  caption: string;
  sortOrder: number;
  createdAt: string;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  series: string;
  year: string;
  materials: string;
  size: string;
  price: string;
  currency: string;
  status: ArtworkStatus;
  showInGallery: boolean;
  description: string;
  photos: ArtworkPhoto[];
  primaryPhotoId: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ArtworkPhotoInput = Pick<ArtworkPhoto, "alt" | "caption" | "sortOrder">;

export type ArtworkInput = Pick<
  Artwork,
  | "slug"
  | "title"
  | "series"
  | "year"
  | "materials"
  | "size"
  | "price"
  | "currency"
  | "status"
  | "showInGallery"
  | "description"
  | "sortOrder"
>;

export type ArtworkSummary = Pick<
  Artwork,
  "id" | "slug" | "title" | "series" | "year" | "status" | "showInGallery" | "sortOrder" | "updatedAt"
> & {
  previewUrl: string | null;
};

export type ArtworkListRecord = {
  id: string;
  slug: string;
  title: string;
  series: string;
  year: string;
  status: ArtworkStatus;
  showInGallery: boolean;
  sortOrder: number;
  updatedAt: string;
  previewUrl: string | null;
};

export function getPrimaryPhoto(artwork: Artwork) {
  if (!artwork.photos.length) {
    return null;
  }

  return artwork.photos.find((photo) => photo.id === artwork.primaryPhotoId) ?? artwork.photos[0] ?? null;
}

export function toArtworkSummary(artwork: Artwork): ArtworkSummary {
  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    series: artwork.series,
    year: artwork.year,
    status: artwork.status,
    showInGallery: artwork.showInGallery,
    sortOrder: artwork.sortOrder,
    updatedAt: artwork.updatedAt,
    previewUrl: getPrimaryPhoto(artwork)?.urlPreview ?? null,
  };
}
