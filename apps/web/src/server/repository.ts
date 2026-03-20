import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ArtworkRepository } from "@/features/artworks/repository";
import type { Artwork, ArtworkInput } from "@/features/artworks/types";
import { appConfig } from "@/server/config";

async function ensureDataFile() {
  const directory = path.dirname(appConfig.artworksDataFile);
  await mkdir(directory, { recursive: true });

  try {
    await readFile(appConfig.artworksDataFile, "utf8");
  } catch {
    await writeFile(appConfig.artworksDataFile, "[]\n", "utf8");
  }
}

async function readArtworks() {
  await ensureDataFile();
  const raw = await readFile(appConfig.artworksDataFile, "utf8");
  const parsed = JSON.parse(raw) as Artwork[];
  return parsed.sort((left, right) => left.order - right.order);
}

async function writeArtworks(artworks: Artwork[]) {
  const sorted = [...artworks].sort((left, right) => left.order - right.order);
  await writeFile(appConfig.artworksDataFile, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

function assertUniqueSlug(artworks: Artwork[], slug: string, currentId?: string) {
  const exists = artworks.some((artwork) => artwork.slug === slug && artwork.id !== currentId);

  if (exists) {
    throw new Error("Artwork slug must be unique.");
  }
}

class JsonArtworkRepository implements ArtworkRepository {
  async listPublic() {
    const artworks = await readArtworks();
    return artworks.filter((artwork) => artwork.status !== "hidden");
  }

  async listAll() {
    return readArtworks();
  }

  async getBySlug(slug: string) {
    const artworks = await readArtworks();
    return artworks.find((artwork) => artwork.slug === slug) ?? null;
  }

  async getById(id: string) {
    const artworks = await readArtworks();
    return artworks.find((artwork) => artwork.id === id) ?? null;
  }

  async create(input: ArtworkInput) {
    const artworks = await readArtworks();
    assertUniqueSlug(artworks, input.slug);

    const artwork: Artwork = {
      id: crypto.randomUUID(),
      ...input,
    };

    artworks.push(artwork);
    await writeArtworks(artworks);
    return artwork;
  }

  async update(id: string, input: ArtworkInput) {
    const artworks = await readArtworks();
    const index = artworks.findIndex((artwork) => artwork.id === id);

    if (index === -1) {
      throw new Error("Artwork not found.");
    }

    assertUniqueSlug(artworks, input.slug, id);

    const artwork: Artwork = {
      id,
      ...input,
    };

    artworks[index] = artwork;
    await writeArtworks(artworks);
    return artwork;
  }

  async delete(id: string) {
    const artworks = await readArtworks();
    const filtered = artworks.filter((artwork) => artwork.id !== id);

    if (filtered.length === artworks.length) {
      throw new Error("Artwork not found.");
    }

    await writeArtworks(filtered);
  }

  async reorder(idsInOrder: string[]) {
    const artworks = await readArtworks();
    const orderMap = new Map(idsInOrder.map((id, index) => [id, index + 1]));
    const reordered = artworks.map((artwork, index) => ({
      ...artwork,
      order: orderMap.get(artwork.id) ?? index + 1,
    }));

    await writeArtworks(reordered);
    return reordered.sort((left, right) => left.order - right.order);
  }
}

let repositoryInstance: ArtworkRepository | null = null;

export function getArtworkRepository() {
  if (!repositoryInstance) {
    repositoryInstance = new JsonArtworkRepository();
  }

  return repositoryInstance;
}
