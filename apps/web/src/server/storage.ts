import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { appConfig } from "@/server/config";

export type UploadResult = {
  url: string;
  key: string;
  contentType: string;
};

export interface AssetStorage {
  upload(file: File): Promise<UploadResult>;
  remove(key: string): Promise<void>;
}

function sanitizeFilename(filename: string) {
  const normalized = filename.toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
  return normalized || "upload.bin";
}

class LocalAssetStorage implements AssetStorage {
  async upload(file: File): Promise<UploadResult> {
    await mkdir(appConfig.uploadsDirectory, { recursive: true });

    const extension = path.extname(file.name) || ".bin";
    const safeFilename = sanitizeFilename(path.basename(file.name, extension));
    const key = `${Date.now()}-${safeFilename}${extension}`;
    const fullPath = path.join(appConfig.uploadsDirectory, key);
    const bytes = await file.arrayBuffer();

    await writeFile(fullPath, Buffer.from(bytes));

    return {
      url: `/uploads/${key}`,
      key,
      contentType: file.type || "application/octet-stream",
    };
  }

  async remove(key: string): Promise<void> {
    if (!key) {
      return;
    }

    const fullPath = path.join(appConfig.uploadsDirectory, path.basename(key));

    try {
      await unlink(fullPath);
    } catch {
      // Best-effort cleanup for local MVP uploads.
    }
  }
}

let storageInstance: AssetStorage | null = null;

export function getAssetStorage() {
  if (!storageInstance) {
    storageInstance = new LocalAssetStorage();
  }

  return storageInstance;
}
