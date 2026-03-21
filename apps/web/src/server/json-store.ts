import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { appConfig } from "@/server/config";
import { deleteObject, getObjectText, putObjectText } from "@/server/object-storage";

function localPathForKey(key: string) {
  return path.join(appConfig.localRuntimeRoot, ...key.split("/"));
}

export async function readJsonFile<T>(key: string, fallback: T): Promise<T> {
  if (appConfig.storageMode === "s3") {
    try {
      const raw = await getObjectText(key);
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  const filePath = localPathForKey(key);

  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(key: string, value: T) {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;

  if (appConfig.storageMode === "s3") {
    await putObjectText(key, serialized);
    return;
  }

  const filePath = localPathForKey(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, serialized, "utf8");
}

export async function deleteJsonFile(key: string) {
  if (appConfig.storageMode === "s3") {
    await deleteObject(key);
    return;
  }

  const filePath = localPathForKey(key);

  try {
    await unlink(filePath);
  } catch {
    // Best effort cleanup.
  }
}
