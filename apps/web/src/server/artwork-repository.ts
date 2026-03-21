import type { Artwork, ArtworkInput, ArtworkListRecord, ArtworkPhoto } from "@/features/artworks/types";
import { toArtworkSummary } from "@/features/artworks/types";
import { appConfig } from "@/server/config";
import { deleteJsonFile, readJsonFile, writeJsonFile } from "@/server/json-store";
import { newId, nowIso, slugify } from "@/server/utils";

type ArtworksIndex = {
  updatedAt: string;
  items: ArtworkListRecord[];
};

const artworksIndexKey = `${appConfig.dataPrefix}/artworks/index.json`;

function artworkKey(id: string) {
  return `${appConfig.dataPrefix}/artworks/${id}.json`;
}

function normalizeArtwork(artwork: Artwork): Artwork {
  return {
    ...artwork,
    series: artwork.series ?? "",
    year: artwork.year ?? "",
    price: artwork.price ?? "",
    currency: artwork.currency ?? "RUB",
    isArchived: Boolean(artwork.isArchived),
    showInGallery: Boolean(artwork.showInGallery),
  };
}

function normalizeArtworkListRecord(item: ArtworkListRecord): ArtworkListRecord {
  return {
    ...item,
    series: item.series ?? "",
    year: item.year ?? "",
    isArchived: Boolean(item.isArchived),
    showInGallery: Boolean(item.showInGallery),
  };
}

async function readIndex() {
  const index = await readJsonFile<ArtworksIndex>(artworksIndexKey, {
    updatedAt: nowIso(),
    items: [],
  });

  return {
    ...index,
    items: index.items.map(normalizeArtworkListRecord),
  };
}

async function writeIndex(items: ArtworkListRecord[]) {
  await writeJsonFile(artworksIndexKey, {
    updatedAt: nowIso(),
    items: [...items].sort((left, right) => left.sortOrder - right.sortOrder),
  });
}

async function assertUniqueSlug(slug: string, currentId?: string) {
  const index = await readIndex();
  const existing = index.items.find((item) => item.slug === slug && item.id !== currentId);

  if (existing) {
    throw new Error("Artwork slug must be unique.");
  }
}

export async function listArtworkSummaries() {
  const index = await readIndex();
  return [...index.items].sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function listArtworks() {
  const items = await listArtworkSummaries();
  const artworks = await Promise.all(items.map((item) => getArtworkById(item.id)));
  return artworks.filter((artwork): artwork is Artwork => Boolean(artwork));
}

export async function listPublicArtworks() {
  const artworks = await listArtworks();
  return artworks.filter((artwork) => !artwork.isArchived && artwork.showInGallery);
}

export async function getArtworkById(id: string) {
  const artwork = await readJsonFile<Artwork | null>(artworkKey(id), null);
  return artwork ? normalizeArtwork(artwork) : null;
}

export async function getArtworkBySlug(slug: string) {
  const summaries = await listArtworkSummaries();
  const found = summaries.find((item) => item.slug === slug);
  return found ? getArtworkById(found.id) : null;
}

export async function createArtwork(input: ArtworkInput) {
  const slug = slugify(input.slug || input.title);
  await assertUniqueSlug(slug);

  const timestamp = nowIso();
  const artwork: Artwork = {
    id: newId(),
    slug,
    title: input.title,
    series: input.series,
    year: input.year,
    materials: input.materials,
    size: input.size,
    price: input.price,
    currency: input.currency,
    status: input.status,
    isArchived: input.isArchived,
    showInGallery: input.showInGallery,
    description: input.description,
    photos: [],
    primaryPhotoId: null,
    sortOrder: input.sortOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeJsonFile(artworkKey(artwork.id), normalizeArtwork(artwork));
  const index = await listArtworkSummaries();
  index.push(toArtworkSummary(artwork));
  await writeIndex(index);
  return artwork;
}

export async function updateArtwork(id: string, input: ArtworkInput) {
  const existing = await getArtworkById(id);

  if (!existing) {
    throw new Error("Artwork not found.");
  }

  const slug = slugify(input.slug || input.title);
  await assertUniqueSlug(slug, id);

  const artwork: Artwork = normalizeArtwork({
    ...existing,
    ...input,
    slug,
    updatedAt: nowIso(),
  });

  await writeJsonFile(artworkKey(id), artwork);
  const index = await listArtworkSummaries();
  await writeIndex(index.map((item) => (item.id === id ? toArtworkSummary(artwork) : item)));
  return artwork;
}

export async function deleteArtwork(id: string) {
  const artwork = await getArtworkById(id);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  await deleteJsonFile(artworkKey(id));
  const index = await listArtworkSummaries();
  await writeIndex(index.filter((item) => item.id !== id));
  return artwork;
}

export async function reorderArtworks(idsInOrder: string[]) {
  const artworks = await listArtworks();
  const orderMap = new Map(idsInOrder.map((id, index) => [id, index + 1]));

  const updated = await Promise.all(
    artworks.map(async (artwork, index) => {
      const nextOrder = orderMap.get(artwork.id) ?? index + 1;

      if (nextOrder === artwork.sortOrder) {
        return artwork;
      }

      const nextArtwork = {
        ...artwork,
        sortOrder: nextOrder,
        updatedAt: nowIso(),
      };

      await writeJsonFile(artworkKey(artwork.id), nextArtwork);
      return nextArtwork;
    }),
  );

  await writeIndex(updated.map(toArtworkSummary));
  return updated.sort((left, right) => left.sortOrder - right.sortOrder);
}

export async function addArtworkPhoto(artworkId: string, photo: ArtworkPhoto) {
  const artwork = await getArtworkById(artworkId);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  const photos = [...artwork.photos, photo]
    .map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }))
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const updated: Artwork = {
    ...normalizeArtwork(artwork),
    photos,
    primaryPhotoId: artwork.primaryPhotoId ?? photo.id,
    updatedAt: nowIso(),
  };

  await writeJsonFile(artworkKey(artworkId), updated);
  const index = await listArtworkSummaries();
  await writeIndex(index.map((item) => (item.id === artworkId ? toArtworkSummary(updated) : item)));
  return updated;
}

export async function updateArtworkPhotoMetadata(
  artworkId: string,
  photoId: string,
  updates: Partial<Pick<ArtworkPhoto, "alt" | "caption">>,
) {
  const artwork = await getArtworkById(artworkId);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  const updated: Artwork = {
    ...normalizeArtwork(artwork),
    photos: artwork.photos.map((photo) => (photo.id === photoId ? { ...photo, ...updates } : photo)),
    updatedAt: nowIso(),
  };

  await writeJsonFile(artworkKey(artworkId), updated);
  return updated;
}

export async function removeArtworkPhoto(artworkId: string, photoId: string) {
  const artwork = await getArtworkById(artworkId);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  const removed = artwork.photos.find((photo) => photo.id === photoId) ?? null;
  const photos = artwork.photos
    .filter((photo) => photo.id !== photoId)
    .map((photo, index) => ({ ...photo, sortOrder: index + 1 }));
  const nextPrimary = artwork.primaryPhotoId === photoId ? (photos[0]?.id ?? null) : artwork.primaryPhotoId;
  const updated: Artwork = {
    ...normalizeArtwork(artwork),
    photos,
    primaryPhotoId: nextPrimary,
    updatedAt: nowIso(),
  };

  await writeJsonFile(artworkKey(artworkId), updated);
  const index = await listArtworkSummaries();
  await writeIndex(index.map((item) => (item.id === artworkId ? toArtworkSummary(updated) : item)));
  return {
    artwork: updated,
    removed,
  };
}

export async function setPrimaryArtworkPhoto(artworkId: string, photoId: string) {
  const artwork = await getArtworkById(artworkId);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  if (!artwork.photos.some((photo) => photo.id === photoId)) {
    throw new Error("Photo not found.");
  }

  const updated: Artwork = {
    ...normalizeArtwork(artwork),
    primaryPhotoId: photoId,
    updatedAt: nowIso(),
  };

  await writeJsonFile(artworkKey(artworkId), updated);
  const index = await listArtworkSummaries();
  await writeIndex(index.map((item) => (item.id === artworkId ? toArtworkSummary(updated) : item)));
  return updated;
}

export async function reorderArtworkPhotos(artworkId: string, photoIds: string[]) {
  const artwork = await getArtworkById(artworkId);

  if (!artwork) {
    throw new Error("Artwork not found.");
  }

  const orderMap = new Map(photoIds.map((photoId, index) => [photoId, index + 1]));
  const updated: Artwork = {
    ...normalizeArtwork(artwork),
    photos: artwork.photos
      .map((photo, index) => ({
        ...photo,
        sortOrder: orderMap.get(photo.id) ?? index + 1,
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder),
    updatedAt: nowIso(),
  };

  await writeJsonFile(artworkKey(artworkId), updated);
  return updated;
}

export async function applyBulkArtworkAction(ids: string[], action: "delete" | "archive" | "unarchive") {
  const uniqueIds = [...new Set(ids.filter(Boolean))];

  if (uniqueIds.length === 0) {
    return await listArtworkSummaries();
  }

  if (action === "delete") {
    for (const id of uniqueIds) {
      const artwork = await getArtworkById(id);

      if (artwork) {
        await deleteJsonFile(artworkKey(id));
      }
    }

    const index = await listArtworkSummaries();
    const nextItems = index.filter((item) => !uniqueIds.includes(item.id));
    await writeIndex(nextItems);
    return nextItems;
  }

  const summaries = await listArtworkSummaries();
  const updatedSummaries: ArtworkListRecord[] = [];

  for (const summary of summaries) {
    if (!uniqueIds.includes(summary.id)) {
      updatedSummaries.push(summary);
      continue;
    }

    const artwork = await getArtworkById(summary.id);

    if (!artwork) {
      continue;
    }

    const updatedArtwork = normalizeArtwork({
      ...artwork,
      isArchived: action === "archive",
      updatedAt: nowIso(),
    });

    await writeJsonFile(artworkKey(updatedArtwork.id), updatedArtwork);
    updatedSummaries.push(toArtworkSummary(updatedArtwork));
  }

  await writeIndex(updatedSummaries);
  return updatedSummaries.sort((left, right) => left.sortOrder - right.sortOrder);
}
