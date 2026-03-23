import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

import type { ArtworkPhoto } from "@/features/artworks/types";
import { appConfig } from "@/server/config";
import { deleteObject, putObjectBuffer } from "@/server/object-storage";
import { newId, nowIso } from "@/server/utils";

const supportedUploadMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function resolveSupportedMimeType(file: File) {
  const mimeType = (file.type || "").toLowerCase();
  if (supportedUploadMimeTypes.has(mimeType)) {
    return mimeType;
  }

  const extension = path.extname(file.name).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }
  if (extension === ".png") {
    return "image/png";
  }
  if (extension === ".webp") {
    return "image/webp";
  }

  return null;
}

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

async function createPreviewBuffer(originalBuffer: Buffer) {
  try {
    const sharpModule = await import("sharp");
    const sharpFactory = sharpModule.default;
    return await sharpFactory(originalBuffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  } catch (error) {
    console.warn("Artwork preview generation skipped", {
      message: error instanceof Error ? error.message : "Unknown sharp error",
    });
    return null;
  }
}

export async function uploadArtworkImage(file: File, artworkId: string) {
  const mimeType = resolveSupportedMimeType(file);

  if (!mimeType) {
    throw new Error("Поддерживаются только JPEG, PNG и WEBP.");
  }

  const id = newId();
  const extension = path.extname(file.name) || ".jpg";
  const safeFilename = sanitizeFilename(file.name);
  const baseKey = `${artworkId}/${id}-${safeFilename.replace(extension, "")}`;
  const originalKey = `${appConfig.mediaPrefix}/${baseKey}${extension}`;
  const previewKey = `${appConfig.mediaPrefix}/${baseKey}-preview.webp`;
  const originalBuffer = Buffer.from(await file.arrayBuffer());
  const previewBuffer = await createPreviewBuffer(originalBuffer);

  let urlOriginal = "";
  let urlPreview = "";

  if (appConfig.storageMode === "s3") {
    await putObjectBuffer(originalKey, originalBuffer, mimeType);
    urlOriginal = publicObjectUrl(originalKey);
    if (previewBuffer) {
      await putObjectBuffer(previewKey, previewBuffer, "image/webp");
      urlPreview = publicObjectUrl(previewKey);
    } else {
      urlPreview = urlOriginal;
    }
  } else {
    urlOriginal = await writeLocalMedia(path.basename(originalKey), originalBuffer);
    if (previewBuffer) {
      urlPreview = await writeLocalMedia(path.basename(previewKey), previewBuffer);
    } else {
      urlPreview = urlOriginal;
    }
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

export async function importRemoteArtworkImage(sourceUrl: string, artworkId: string, filenameHint: string) {
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch remote artwork image: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const extension = contentType.includes("png") ? ".png" : contentType.includes("webp") ? ".webp" : ".jpg";
  const safeFilename = sanitizeFilename(`${filenameHint}${extension}`);
  const id = newId();
  const baseKey = `${artworkId}/${id}-${safeFilename.replace(extension, "")}`;
  const originalKey = `${appConfig.mediaPrefix}/${baseKey}${extension}`;
  const previewKey = `${appConfig.mediaPrefix}/${baseKey}-preview.webp`;
  const originalBuffer = Buffer.from(await response.arrayBuffer());
  const previewBuffer = await createPreviewBuffer(originalBuffer);

  let urlOriginal = "";
  let urlPreview = "";

  if (appConfig.storageMode === "s3") {
    await putObjectBuffer(originalKey, originalBuffer, contentType);
    urlOriginal = publicObjectUrl(originalKey);
    if (previewBuffer) {
      await putObjectBuffer(previewKey, previewBuffer, "image/webp");
      urlPreview = publicObjectUrl(previewKey);
    } else {
      urlPreview = urlOriginal;
    }
  } else {
    urlOriginal = await writeLocalMedia(path.basename(originalKey), originalBuffer);
    if (previewBuffer) {
      urlPreview = await writeLocalMedia(path.basename(previewKey), previewBuffer);
    } else {
      urlPreview = urlOriginal;
    }
  }

  return {
    photo: {
      id,
      storageKey: originalKey,
      previewStorageKey: previewKey,
      urlOriginal,
      urlPreview,
      alt: "",
      caption: "",
      sortOrder: 0,
      createdAt: nowIso(),
    },
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
