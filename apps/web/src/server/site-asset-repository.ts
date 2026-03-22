import type {
  PublicVariantSiteAssets,
  SiteAssetPageKey,
  SiteAssetPayload,
  SiteAssetPublication,
  SiteAssetSlotKey,
  SiteAssetVersion,
  SiteAssetVersionRecord,
} from "@/features/site-assets/types";
import { appConfig } from "@/server/config";
import { readJsonFile, writeJsonFile } from "@/server/json-store";
import { variantSiteAssets as seedVariantSiteAssets } from "@/server/seed-site-assets";
import { newId, nowIso } from "@/server/utils";

type SiteAssetIndex = {
  variantId: string;
  pageKey: SiteAssetPageKey;
  slotKey: SiteAssetSlotKey;
  updatedAt: string;
  items: SiteAssetVersionRecord[];
};

function slotPageKey(slotKey: SiteAssetSlotKey): SiteAssetPageKey {
  return slotKey.startsWith("home.") ? "home" : "about";
}

function siteAssetIndexKey(variantId: string, slotKey: SiteAssetSlotKey) {
  return `${appConfig.dataPrefix}/site-assets/${variantId}/${slotPageKey(slotKey)}/${slotKey}/index.json`;
}

function siteAssetVersionKey(variantId: string, slotKey: SiteAssetSlotKey, versionId: string) {
  return `${appConfig.dataPrefix}/site-assets/${variantId}/${slotPageKey(slotKey)}/${slotKey}/${versionId}.json`;
}

function publicationKey(variantId: string) {
  return `${appConfig.dataPrefix}/site-assets-publication/${variantId}.json`;
}

async function readIndex(variantId: string, slotKey: SiteAssetSlotKey) {
  const pageKey = slotPageKey(slotKey);
  return readJsonFile<SiteAssetIndex>(siteAssetIndexKey(variantId, slotKey), {
    variantId,
    pageKey,
    slotKey,
    updatedAt: nowIso(),
    items: [],
  });
}

async function writeIndex(variantId: string, slotKey: SiteAssetSlotKey, items: SiteAssetVersionRecord[]) {
  await writeJsonFile(siteAssetIndexKey(variantId, slotKey), {
    variantId,
    pageKey: slotPageKey(slotKey),
    slotKey,
    updatedAt: nowIso(),
    items: [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
  });
}

async function createVersionRecord(
  variantId: string,
  slotKey: SiteAssetSlotKey,
  versionName: string,
  payload: SiteAssetPayload,
  status: SiteAssetVersion["status"] = "draft",
) {
  const timestamp = nowIso();
  const version: SiteAssetVersion = {
    id: newId(),
    variantId,
    pageKey: slotPageKey(slotKey),
    slotKey,
    versionName,
    status,
    payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeJsonFile(siteAssetVersionKey(variantId, slotKey, version.id), version);
  const index = await readIndex(variantId, slotKey);
  await writeIndex(variantId, slotKey, [
    {
      id: version.id,
      versionName: version.versionName,
      status: version.status,
      updatedAt: version.updatedAt,
      isPublishedActive: false,
    },
    ...index.items,
  ]);

  return version;
}

function nextClonedVersionName(versionName: string) {
  const trimmed = versionName.trim();
  const match = trimmed.match(/^(.*?)(?:\s+(\d+))?$/);

  if (!match) {
    return `${trimmed} 2`;
  }

  const base = (match[1] || trimmed).trim();
  const number = match[2] ? Number(match[2]) : 1;
  return `${base} ${number + 1}`;
}

function buildSeedVersionName(slotKey: SiteAssetSlotKey) {
  if (slotKey === "home.heroImage") {
    return "Текущий hero image";
  }

  return "Текущий portrait image";
}

function getSeedPayload(variantId: string, slotKey: SiteAssetSlotKey) {
  const variant = seedVariantSiteAssets[variantId];

  if (!variant) {
    return null;
  }

  if (slotKey === "home.heroImage") {
    return variant.home.heroImage;
  }

  if (slotKey === "about.portraitImage") {
    return variant.about.portraitImage;
  }

  return null;
}

export async function getSiteAssetPublication(variantId: string) {
  return readJsonFile<SiteAssetPublication>(publicationKey(variantId), {
    variantId,
    activeVersions: {},
    updatedAt: nowIso(),
  });
}

export async function ensureSeedSiteAssetVersion(variantId: string, slotKey: SiteAssetSlotKey) {
  const index = await readIndex(variantId, slotKey);

  if (index.items.length > 0) {
    return index.items;
  }

  const seedPayload = getSeedPayload(variantId, slotKey);

  if (!seedPayload) {
    return index.items;
  }

  const created = await createVersionRecord(variantId, slotKey, buildSeedVersionName(slotKey), seedPayload, "published");
  const publication = await getSiteAssetPublication(variantId);

  await writeJsonFile(publicationKey(variantId), {
    ...publication,
    activeVersions: {
      ...publication.activeVersions,
      [slotKey]: created.id,
    },
    updatedAt: nowIso(),
  } satisfies SiteAssetPublication);

  return (await readIndex(variantId, slotKey)).items;
}

export async function getSiteAssetVersion(variantId: string, slotKey: SiteAssetSlotKey, versionId: string) {
  await ensureSeedSiteAssetVersion(variantId, slotKey);
  return readJsonFile<SiteAssetVersion | null>(siteAssetVersionKey(variantId, slotKey, versionId), null);
}

export async function listSiteAssetVersions(variantId: string, slotKey: SiteAssetSlotKey) {
  await ensureSeedSiteAssetVersion(variantId, slotKey);
  const index = await readIndex(variantId, slotKey);
  const publication = await getSiteAssetPublication(variantId);
  return index.items.map((item) => ({
    ...item,
    isPublishedActive: publication.activeVersions[slotKey] === item.id,
  }));
}

export async function createSiteAssetVersion(
  variantId: string,
  slotKey: SiteAssetSlotKey,
  versionName: string,
  payload: SiteAssetPayload,
) {
  return createVersionRecord(variantId, slotKey, versionName, payload, "draft");
}

export async function cloneSiteAssetVersion(variantId: string, slotKey: SiteAssetSlotKey, versionId: string) {
  const version = await getSiteAssetVersion(variantId, slotKey, versionId);

  if (!version) {
    throw new Error("Site asset version not found.");
  }

  return createSiteAssetVersion(variantId, slotKey, nextClonedVersionName(version.versionName), version.payload);
}

export async function updateSiteAssetVersion(
  variantId: string,
  slotKey: SiteAssetSlotKey,
  versionId: string,
  updates: Pick<SiteAssetVersion, "versionName" | "payload" | "status">,
) {
  const existing = await getSiteAssetVersion(variantId, slotKey, versionId);

  if (!existing) {
    throw new Error("Site asset version not found.");
  }

  const nextVersion: SiteAssetVersion = {
    ...existing,
    ...updates,
    updatedAt: nowIso(),
  };

  await writeJsonFile(siteAssetVersionKey(variantId, slotKey, versionId), nextVersion);
  const items = await listSiteAssetVersions(variantId, slotKey);
  await writeIndex(
    variantId,
    slotKey,
    items.map((item) =>
      item.id === versionId
        ? {
            id: versionId,
            versionName: nextVersion.versionName,
            status: nextVersion.status,
            updatedAt: nextVersion.updatedAt,
            isPublishedActive: item.isPublishedActive ?? false,
          }
        : item,
    ),
  );

  return nextVersion;
}

export async function publishSiteAssetVersion(variantId: string, slotKey: SiteAssetSlotKey, versionId: string) {
  const version = await getSiteAssetVersion(variantId, slotKey, versionId);

  if (!version) {
    throw new Error("Site asset version not found.");
  }

  const publishedVersion = await updateSiteAssetVersion(variantId, slotKey, versionId, {
    versionName: version.versionName,
    payload: version.payload,
    status: "published",
  });

  const publication = await getSiteAssetPublication(variantId);
  const nextPublication: SiteAssetPublication = {
    ...publication,
    activeVersions: {
      ...publication.activeVersions,
      [slotKey]: publishedVersion.id,
    },
    updatedAt: nowIso(),
  };

  await writeJsonFile(publicationKey(variantId), nextPublication);
  return nextPublication;
}

async function getPublishedSlotAsset(variantId: string, slotKey: SiteAssetSlotKey, fallback: SiteAssetPayload | null) {
  const publication = await getSiteAssetPublication(variantId);
  const versionId = publication.activeVersions[slotKey];

  if (!versionId) {
    return fallback;
  }

  const version = await getSiteAssetVersion(variantId, slotKey, versionId);
  return version?.payload ?? fallback;
}

export async function getPublishedVariantSiteAssets(
  variantId: string,
  defaults: PublicVariantSiteAssets,
): Promise<PublicVariantSiteAssets> {
  await ensureSeedSiteAssetVersion(variantId, "home.heroImage");
  await ensureSeedSiteAssetVersion(variantId, "about.portraitImage");

  return {
    home: {
      heroImage: await getPublishedSlotAsset(variantId, "home.heroImage", defaults.home.heroImage),
    },
    about: {
      portraitImage: await getPublishedSlotAsset(variantId, "about.portraitImage", defaults.about.portraitImage),
    },
  };
}
