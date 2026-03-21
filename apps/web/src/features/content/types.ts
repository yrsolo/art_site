export const contentPageKeys = ["home", "gallery", "artwork", "about", "contacts"] as const;
export type ContentPageKey = (typeof contentPageKeys)[number];

export const contentVersionStatuses = ["draft", "published", "archived"] as const;
export type ContentVersionStatus = (typeof contentVersionStatuses)[number];

export type HomeContentPayload = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

export type GalleryContentPayload = {
  eyebrow: string;
  title: string;
  description: string;
};

export type AboutContentPayload = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
};

export type ContactsContentPayload = {
  eyebrow: string;
  title: string;
  description: string;
  channels: string[];
  inquiryLabel: string;
};

export type ArtworkDetailContentPayload = {
  inquiryLabel: string;
  note: string;
};

export type ContentPayloadMap = {
  home: HomeContentPayload;
  gallery: GalleryContentPayload;
  artwork: ArtworkDetailContentPayload;
  about: AboutContentPayload;
  contacts: ContactsContentPayload;
};

export type ContentPayload = ContentPayloadMap[ContentPageKey];

export type ContentVersion<P extends ContentPageKey = ContentPageKey> = {
  id: string;
  variantId: string;
  pageKey: P;
  versionName: string;
  status: ContentVersionStatus;
  payload: ContentPayloadMap[P];
  createdAt: string;
  updatedAt: string;
};

export type ContentVersionRecord = {
  id: string;
  versionName: string;
  status: ContentVersionStatus;
  updatedAt: string;
};

export type PagePublication = {
  variantId: string;
  activeVersions: Partial<Record<ContentPageKey, string>>;
  updatedAt: string;
};

export type PublicVariantContent = {
  nav: {
    home: string;
    gallery: string;
    about: string;
    contacts: string;
  };
  home: HomeContentPayload;
  gallery: GalleryContentPayload;
  about: AboutContentPayload;
  contacts: ContactsContentPayload;
  detail: ArtworkDetailContentPayload;
};

export type PublicSiteSnapshot = {
  generatedAt: string;
  artworks: import("@/features/artworks/types").Artwork[];
  variantContent: Record<string, PublicVariantContent>;
};
