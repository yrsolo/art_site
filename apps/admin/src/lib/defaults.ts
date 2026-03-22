import type { Artwork, ContentVersion, PageKey, SiteAssetSlotKey, SiteAssetVersion } from "@/lib/types";

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
    isArchived: false,
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

export function createEmptySiteAssetVersion(variantId: string, slotKey: SiteAssetSlotKey): SiteAssetVersion {
  const now = new Date().toISOString();

  return {
    id: "",
    variantId,
    pageKey: slotKey.startsWith("home.") ? "home" : "about",
    slotKey,
    versionName: "Новая версия",
    status: "draft",
    payload: {
      assetId: "",
      url: "",
      alt: "",
      caption: "",
      focalPoint: null,
      decorative: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}
