import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { PublicSiteSnapshot } from "@/features/content/types";
import { appConfig } from "@/server/config";
import { getPublishedVariantContent } from "@/server/content-repository";
import { listPublicArtworks } from "@/server/artwork-repository";
import { getPublishedVariantSiteAssets } from "@/server/site-asset-repository";
import { putObjectText } from "@/server/object-storage";
import { variantContent as defaultVariantContent } from "@/server/seed-variant-content";
import { variantSiteAssets as defaultVariantSiteAssets } from "@/server/seed-site-assets";
import { newId, nowIso } from "@/server/utils";

export async function buildPublicSiteSnapshot(): Promise<PublicSiteSnapshot> {
  const artworks = await listPublicArtworks();
  const [variantEntries, variantSiteAssetEntries] = await Promise.all([
    Promise.all(
    Object.entries(defaultVariantContent).map(async ([variantId, fallback]) => [
      variantId,
      await getPublishedVariantContent(variantId, fallback),
    ]),
    ),
    Promise.all(
      Object.entries(defaultVariantSiteAssets).map(async ([variantId, fallback]) => [
        variantId,
        await getPublishedVariantSiteAssets(variantId, fallback),
      ]),
    ),
  ]);

  const timestamp = nowIso();

  return {
    schemaVersion: 2,
    revision: newId(),
    generatedAt: timestamp,
    publishedAt: timestamp,
    artworks,
    variantContent: Object.fromEntries(variantEntries),
    variantSiteAssets: Object.fromEntries(variantSiteAssetEntries),
  };
}

export async function exportPublicSiteSnapshot() {
  const snapshot = await buildPublicSiteSnapshot();
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
  const targetKey = `${appConfig.publicSnapshotPrefix}/${appConfig.publicSiteSnapshotKey}`;

  if (appConfig.storageMode === "s3") {
    await putObjectText(targetKey, serialized);
    await putObjectText(
      appConfig.publicSiteRuntimeSnapshotKey,
      serialized,
      "application/json; charset=utf-8",
      appConfig.publicSiteBucket,
      "public-read",
    );
  } else {
    await mkdir(path.dirname(appConfig.localPublicSnapshotFile), { recursive: true });
    await writeFile(appConfig.localPublicSnapshotFile, serialized, "utf8");
    const localPublicRuntimeFile = path.join(process.cwd(), "public", "data", path.basename(appConfig.publicSiteRuntimeSnapshotKey));
    await mkdir(path.dirname(localPublicRuntimeFile), { recursive: true });
    await writeFile(localPublicRuntimeFile, serialized, "utf8");
  }

  return {
    key: targetKey,
    snapshot,
  };
}
