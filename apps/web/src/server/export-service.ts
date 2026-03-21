import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { PublicSiteSnapshot } from "@/features/content/types";
import { appConfig } from "@/server/config";
import { getPublishedVariantContent } from "@/server/content-repository";
import { listPublicArtworks } from "@/server/artwork-repository";
import { putObjectText } from "@/server/object-storage";
import { variantContent as defaultVariantContent } from "@/server/seed-variant-content";
import { nowIso } from "@/server/utils";

export async function buildPublicSiteSnapshot(): Promise<PublicSiteSnapshot> {
  const artworks = await listPublicArtworks();
  const variantEntries = await Promise.all(
    Object.entries(defaultVariantContent).map(async ([variantId, fallback]) => [
      variantId,
      await getPublishedVariantContent(variantId, fallback),
    ]),
  );

  return {
    generatedAt: nowIso(),
    artworks,
    variantContent: Object.fromEntries(variantEntries),
  };
}

export async function exportPublicSiteSnapshot() {
  const snapshot = await buildPublicSiteSnapshot();
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
  const targetKey = `${appConfig.publicSnapshotPrefix}/${appConfig.publicSiteSnapshotKey}`;

  if (appConfig.storageMode === "s3") {
    await putObjectText(targetKey, serialized);
  } else {
    await mkdir(path.dirname(appConfig.localPublicSnapshotFile), { recursive: true });
    await writeFile(appConfig.localPublicSnapshotFile, serialized, "utf8");
  }

  return {
    key: targetKey,
    snapshot,
  };
}
