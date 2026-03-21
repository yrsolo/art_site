export const siteAssetPageKeys = ["home", "about"] as const;
export type SiteAssetPageKey = (typeof siteAssetPageKeys)[number];

export const siteAssetSlotKeys = ["home.heroImage", "about.portraitImage"] as const;
export type SiteAssetSlotKey = (typeof siteAssetSlotKeys)[number];

export const siteAssetVersionStatuses = ["draft", "published", "archived"] as const;
export type SiteAssetVersionStatus = (typeof siteAssetVersionStatuses)[number];

export type SiteAssetPayload = {
  assetId: string;
  url: string;
  alt: string;
  caption: string;
  focalPoint: {
    x: number;
    y: number;
  } | null;
  decorative: boolean;
  variantOverrides?: Record<string, string>;
};

export type SiteAssetVersion<P extends SiteAssetSlotKey = SiteAssetSlotKey> = {
  id: string;
  variantId: string;
  pageKey: SiteAssetPageKey;
  slotKey: P;
  versionName: string;
  status: SiteAssetVersionStatus;
  payload: SiteAssetPayload;
  createdAt: string;
  updatedAt: string;
};

export type SiteAssetVersionRecord = {
  id: string;
  versionName: string;
  status: SiteAssetVersionStatus;
  updatedAt: string;
  isPublishedActive?: boolean;
};

export type SiteAssetPublication = {
  variantId: string;
  activeVersions: Partial<Record<SiteAssetSlotKey, string>>;
  updatedAt: string;
};

export type PublicVariantSiteAssets = {
  home: {
    heroImage: SiteAssetPayload | null;
  };
  about: {
    portraitImage: SiteAssetPayload | null;
  };
};
