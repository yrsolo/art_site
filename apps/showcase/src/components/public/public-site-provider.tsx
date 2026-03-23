"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  getDisplayArtworks,
  getEmbeddedPublicSiteSnapshot,
  getPublicArtworkBySlug,
  getSnapshotVariantContent,
  getSnapshotVariantSiteAssets,
  normalizePublicSiteSnapshot,
  publicSnapshotUrl,
  type PublicSiteSnapshot,
} from "@/data/public-site";

type PublicSiteContextValue = {
  snapshot: PublicSiteSnapshot;
  loading: boolean;
};

const PublicSiteContext = createContext<PublicSiteContextValue | null>(null);

export function PublicSiteProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<PublicSiteSnapshot>(() => getEmbeddedPublicSiteSnapshot());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadRuntimeSnapshot() {
      try {
        const response = await fetch(publicSnapshotUrl, { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();

        if (!mounted) {
          return;
        }

        setSnapshot(normalizePublicSiteSnapshot(payload));
      } catch {
        // Keep embedded fallback snapshot.
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadRuntimeSnapshot();

    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      snapshot,
      loading,
    }),
    [loading, snapshot],
  );

  return <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>;
}

function usePublicSiteContext() {
  const context = useContext(PublicSiteContext);

  if (!context) {
    throw new Error("PublicSiteProvider is missing.");
  }

  return context;
}

export function usePublicSnapshot() {
  return usePublicSiteContext();
}

export function useDisplayArtworks() {
  const { snapshot } = usePublicSiteContext();
  return getDisplayArtworks(snapshot);
}

export function usePublicArtworkBySlug(slug: string) {
  const { snapshot } = usePublicSiteContext();
  return getPublicArtworkBySlug(snapshot, slug);
}

export function useVariantContent(variantId: string) {
  const { snapshot } = usePublicSiteContext();
  return getSnapshotVariantContent(snapshot, variantId);
}

export function useVariantSiteAssets(variantId: string) {
  const { snapshot } = usePublicSiteContext();
  return getSnapshotVariantSiteAssets(snapshot, variantId);
}
