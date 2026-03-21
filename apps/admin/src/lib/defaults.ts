import type { Artwork, ContentVersion, PageKey } from "@/lib/types";

export function createEmptyArtwork(): Artwork {
  const now = new Date().toISOString();

  return {
    id: "",
    slug: "",
    title: "",
    series: "",
    year: "",
    materials: "",
    size: "",
    price: "",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    description: "",
    photos: [],
    primaryPhotoId: null,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export function createEmptyContentVersion(variantId: string, pageKey: PageKey): ContentVersion {
  const now = new Date().toISOString();
  return {
    id: "",
    variantId,
    pageKey,
    versionName: "Новая версия",
    status: "draft",
    payload: {},
    createdAt: now,
    updatedAt: now,
  };
}
