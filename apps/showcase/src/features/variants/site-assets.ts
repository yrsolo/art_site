import { templateMedia } from "@/features/variants/template-media";
import type { VariantSiteAssets } from "@/features/variants/types";

export const variantSiteAssets: Record<string, VariantSiteAssets> = {
  "deep-immersion": {
    home: {
      heroImage: {
        assetId: "deep-immersion-home-hero",
        url: templateMedia.deepImmersion.hero,
        alt: "Abstract dark blue and textured painting",
        caption: "",
        focalPoint: null,
        decorative: false,
      },
    },
    about: {
      portraitImage: {
        assetId: "deep-immersion-about-portrait",
        url: templateMedia.deepImmersion.aboutPortrait,
        alt: "Moody black and white portrait of the artist",
        caption: "",
        focalPoint: null,
        decorative: false,
      },
    },
  },
  "cold-mist": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
  "copper-glow": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
  "etheric-pulse": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
  "mint-rose": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
  "olive-cream": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
  "sage-sand": {
    home: { heroImage: null },
    about: { portraitImage: null },
  },
};
