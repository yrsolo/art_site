"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Artwork } from "@/features/artworks/types";

export type GalleryGroupMode = "all" | "year" | "series";

export type GalleryGroup = {
  groupKey: string;
  groupLabel: string;
  itemCount: number;
  items: Artwork[];
  collapsed: boolean;
};

const DEFAULT_PAGE_SIZE = 6;

function normalizeYearLabel(artwork: Artwork) {
  return artwork.year.trim() || "Год не указан";
}

function normalizeSeriesLabel(artwork: Artwork) {
  return artwork.series.trim() || "Без серии";
}

function buildGroupKey(mode: Exclude<GalleryGroupMode, "all">, label: string) {
  return `${mode}:${label}`;
}

export function useGalleryBrowser(artworks: Artwork[], pageSize = DEFAULT_PAGE_SIZE) {
  const orderedArtworks = useMemo(
    () => [...artworks].filter((artwork) => !artwork.isArchived).sort((left, right) => left.order - right.order),
    [artworks],
  );
  const [groupMode, setGroupMode] = useState<GalleryGroupMode>("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [groupMode, pageSize, orderedArtworks.length]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || visibleCount >= orderedArtworks.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((current) => Math.min(current + pageSize, orderedArtworks.length));
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [orderedArtworks.length, pageSize, visibleCount]);

  const visibleArtworks = useMemo(() => orderedArtworks.slice(0, visibleCount), [orderedArtworks, visibleCount]);

  const groups = useMemo<GalleryGroup[]>(() => {
    if (groupMode === "all") {
      return [];
    }

    const labelForArtwork = groupMode === "year" ? normalizeYearLabel : normalizeSeriesLabel;
    const grouped = new Map<string, Artwork[]>();

    for (const artwork of visibleArtworks) {
      const label = labelForArtwork(artwork);
      const items = grouped.get(label) ?? [];
      items.push(artwork);
      grouped.set(label, items);
    }

    return [...grouped.entries()]
      .map(([label, items]) => {
        const groupKey = buildGroupKey(groupMode, label);
        return {
          groupKey,
          groupLabel: label,
          itemCount: items.length,
          items,
          collapsed: Boolean(collapsedGroups[groupKey]),
        };
      })
      .sort((left, right) => left.groupLabel.localeCompare(right.groupLabel, "ru"));
  }, [collapsedGroups, groupMode, visibleArtworks]);

  function toggleGroup(groupKey: string) {
    setCollapsedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }));
  }

  function setMode(nextMode: GalleryGroupMode) {
    if (nextMode === "all") {
      setGroupMode("all");
      return;
    }

    if (nextMode === groupMode) {
      const nextCollapsedValue = !groups.every((group) => group.collapsed);
      setCollapsedGroups(Object.fromEntries(groups.map((group) => [group.groupKey, nextCollapsedValue])));
      return;
    }

    setGroupMode(nextMode);
  }

  return {
    artworks: visibleArtworks,
    groupMode,
    groups,
    hasMore: visibleCount < orderedArtworks.length,
    sentinelRef,
    setMode,
    toggleGroup,
  };
}
