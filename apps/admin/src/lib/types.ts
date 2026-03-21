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

export type ArtworkSummary = {
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

export const variantIds = [
  "deep-immersion",
  "cold-mist",
  "copper-glow",
  "etheric-pulse",
  "mint-rose",
  "olive-cream",
  "sage-sand",
] as const;

export const pageKeys = ["home", "gallery", "artwork", "about", "contacts"] as const;
export type PageKey = (typeof pageKeys)[number];

export type ContentVersion = {
  id: string;
  variantId: string;
  pageKey: PageKey;
  versionName: string;
  status: "draft" | "published" | "archived";
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ContentVersionRecord = {
  id: string;
  versionName: string;
  status: "draft" | "published" | "archived";
  updatedAt: string;
  isPublishedActive?: boolean;
};

export type SessionState = {
  authenticated: boolean;
  username?: string;
  passwordIsDefault?: boolean;
};
