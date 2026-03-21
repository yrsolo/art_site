export const artworkStatuses = ["for_sale", "sold", "off_market", "in_progress"] as const;

export type ArtworkStatus = (typeof artworkStatuses)[number];

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  series: string;
  description: string;
  year: string;
  size: string;
  medium: string;
  price: string;
  currency: string;
  status: ArtworkStatus;
  imageOriginal: string;
  imagePreview: string;
  order: number;
};

export type ArtworkInput = Omit<Artwork, "id">;
