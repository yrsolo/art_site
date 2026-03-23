export type VariantFamily = "dark_atmosphere" | "organic_flow";

export type VariantRouteKey = "home" | "gallery" | "detail" | "about" | "contacts";

export type VariantPageTemplates = Partial<Record<VariantRouteKey, string>>;

export type VariantManifest = {
  id: string;
  family: VariantFamily;
  label: string;
  northStar: string;
  summary: string;
  supportedRoutes: VariantRouteKey[];
  pageTemplates: VariantPageTemplates;
  textSource: string[];
  designInvariants: string[];
  doNotDilute: string[];
  classes: {
    body: string;
    surface: string;
    card: string;
    accent: string;
    subtle: string;
    hero: string;
    pill: string;
    artworkFrame: string;
  };
};

export type VariantContent = {
  nav: {
    home: string;
    gallery: string;
    about: string;
    contacts: string;
  };
  home: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    description: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  contacts: {
    eyebrow: string;
    title: string;
    description: string;
    channels: string[];
    inquiryLabel: string;
  };
  detail: {
    inquiryLabel: string;
    note: string;
  };
};

export type VariantSiteAssets = {
  home: {
    heroImage: {
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
    } | null;
  };
  about: {
    portraitImage: {
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
    } | null;
  };
};
