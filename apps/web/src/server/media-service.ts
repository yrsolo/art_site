import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

import sharp from "sharp";

import type { ArtworkPhoto } from "@/features/artworks/types";
import { appConfig } from "@/server/config";
import { deleteObject, putObjectBuffer } from "@/server/object-storage";
import { newId, nowIso } from "@/server/utils";

function sanitizeFilename(filename: string) {
  const extension = path.extname(filename) || ".jpg";
  const basename = path
    .basename(filename, extension)
    .toLowerCase()
    .replace(/[^a-z0-9\-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${basename || "artwork"}${extension.toLowerCase()}`;
}

function publicObjectUrl(key: string) {
  return `${appConfig.objectStorageEndpoint.replace(/\/$/, "")}/${appConfig.objectStorageBucket}/${key}`;
}

async function writeLocalMedia(filename: string, buffer: Buffer) {
  const target = path.join(appConfig.localMediaRoot, filename);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return `/uploads/${filename}`;
}

export async function uploadArtworkImage(file: File, artworkId: string) {
  const id = newId();
  const extension = path.extname(file.name) || ".jpg";
  const safeFilename = sanitizeFilename(file.name);
  const baseKey = `${artworkId}/${id}-${safeFilename.replace(extension, "")}`;
  const originalKey = `${appConfig.mediaPrefix}/${baseKey}${extension}`;
  const previewKey = `${appConfig.mediaPrefix}/${baseKey}-preview.webp`;
  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const previewBuffer = await sharp(originalBuffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();

  let urlOriginal = "";
  let urlPreview = "";

  if (appConfig.storageMode === "s3") {
    await putObjectBuffer(originalKey, originalBuffer, file.type || "application/octet-stream", "public-read");
    await putObjectBuffer(previewKey, previewBuffer, "image/webp", "public-read");
    urlOriginal = publicObjectUrl(originalKey);
    urlPreview = publicObjectUrl(previewKey);
  } else {
    urlOriginal = await writeLocalMedia(path.basename(originalKey), originalBuffer);
    urlPreview = await writeLocalMedia(path.basename(previewKey), previewBuffer);
  }

  const photo: ArtworkPhoto = {
    id,
    storageKey: originalKey,
    previewStorageKey: previewKey,
    urlOriginal,
    urlPreview,
    alt: "",
    caption: "",
    sortOrder: 0,
    createdAt: nowIso(),
  };

  return {
    photo,
  };
}

export async function removeArtworkImage(originalKey: string, previewKey?: string) {
  if (appConfig.storageMode === "s3") {
    await deleteObject(originalKey);

    if (previewKey) {
      await deleteObject(previewKey);
    }

    return;
  }

  const targets = [originalKey, previewKey].filter(Boolean) as string[];

  await Promise.all(
    targets.map(async (key) => {
      const localFile = path.join(appConfig.localMediaRoot, path.basename(key));

      try {
        await unlink(localFile);
      } catch {
        // best effort
      }
    }),
  );
}
