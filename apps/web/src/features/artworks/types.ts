export const artworkStatuses = ["available", "sold", "hidden"] as const;

export type ArtworkStatus = (typeof artworkStatuses)[number];

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: string;
  size: string;
  medium: string;
  status: ArtworkStatus;
  imageOriginal: string;
  imagePreview: string;
  order: number;
};

export type ArtworkInput = Omit<Artwork, "id">;
