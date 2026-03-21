import type { PublicVariantSiteAssets } from "@/features/site-assets/types";
import { variantContent } from "@/server/seed-variant-content";

export const variantSiteAssets: Record<string, PublicVariantSiteAssets> = Object.fromEntries(
  Object.keys(variantContent).map((variantId) => [
    variantId,
    {
      home: {
        heroImage: null,
      },
      about: {
        portraitImage: null,
      },
    },
  ]),
);
