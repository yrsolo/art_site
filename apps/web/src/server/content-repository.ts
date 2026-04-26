import type {
  ContentPageKey,
  ContentVersion,
  ContentVersionRecord,
  PagePublication,
  PublicVariantContent,
} from "@/features/content/types";
import { contentPageKeys } from "@/features/content/types";
import { appConfig } from "@/server/config";
import { deleteJsonFile, readJsonFile, writeJsonFile } from "@/server/json-store";
import { variantContent as seedVariantContent } from "@/server/seed-variant-content";
import { newId, nowIso } from "@/server/utils";

type ContentIndex = {
  variantId: string;
  pageKey: ContentPageKey;
  updatedAt: string;
  items: ContentVersionRecord[];
};

function contentIndexKey(variantId: string, pageKey: ContentPageKey) {
  return `${appConfig.dataPrefix}/content/${variantId}/${pageKey}/index.json`;
}

function contentVersionKey(variantId: string, pageKey: ContentPageKey, versionId: string) {
  return `${appConfig.dataPrefix}/content/${variantId}/${pageKey}/${versionId}.json`;
}

function publicationKey(variantId: string) {
  return `${appConfig.dataPrefix}/publication/${variantId}.json`;
}

async function readIndex(variantId: string, pageKey: ContentPageKey) {
  return readJsonFile<ContentIndex>(contentIndexKey(variantId, pageKey), {
    variantId,
    pageKey,
    updatedAt: nowIso(),
    items: [],
  });
}

async function writeIndex(variantId: string, pageKey: ContentPageKey, items: ContentVersionRecord[]) {
  await writeJsonFile(contentIndexKey(variantId, pageKey), {
    variantId,
    pageKey,
    updatedAt: nowIso(),
    items: [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
  });
}

async function createVersionRecord(
  variantId: string,
  pageKey: ContentPageKey,
  versionName: string,
  payload: ContentVersion["payload"],
  status: ContentVersion["status"] = "draft",
) {
  const timestamp = nowIso();
  const version: ContentVersion = {
    id: newId(),
    variantId,
    pageKey,
    versionName,
    status,
    payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeJsonFile(contentVersionKey(variantId, pageKey, version.id), version);
  const index = await readIndex(variantId, pageKey);
  await writeIndex(variantId, pageKey, [
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

function getSeedPayload(
  variantId: string,
  pageKey: ContentPageKey,
): ContentVersion["payload"] | null {
  const variant = seedVariantContent[variantId];

  if (!variant) {
    return null;
  }

  if (pageKey === "artwork") {
    return variant.detail;
  }

  return variant[pageKey];
}

function buildSeedVersionName(pageKey: ContentPageKey) {
  switch (pageKey) {
    case "home":
      return "Текущий home";
    case "gallery":
      return "Текущая gallery";
    case "artwork":
      return "Текущий artwork";
    case "about":
      return "Текущий about";
    case "contacts":
      return "Текущие contacts";
    default:
      return "Текущая версия";
  }
}

export async function ensureSeedContentVersion(variantId: string, pageKey: ContentPageKey) {
  const existingItems = await readIndex(variantId, pageKey);

  if (existingItems.items.length > 0) {
    return existingItems.items;
  }

  const seedPayload = getSeedPayload(variantId, pageKey);

  if (!seedPayload) {
    return existingItems.items;
  }

  const created = await createVersionRecord(
    variantId,
    pageKey,
    buildSeedVersionName(pageKey),
    seedPayload as never,
    "published",
  );
  await writeJsonFile(publicationKey(variantId), {
    variantId,
    activeVersions: {
      [pageKey]: created.id,
    },
    updatedAt: nowIso(),
  } satisfies PagePublication);

  const publication = await getPublication(variantId);
  return (await readIndex(variantId, pageKey)).items.map((item) => ({
    ...item,
    isPublishedActive: publication.activeVersions[pageKey] === item.id,
  }));
}

export async function listContentVersions(variantId: string, pageKey: ContentPageKey) {
  await ensureSeedContentVersion(variantId, pageKey);
  const index = await readIndex(variantId, pageKey);
  const publication = await getPublication(variantId);
  return index.items.map((item) => ({
    ...item,
    isPublishedActive: publication.activeVersions[pageKey] === item.id,
  }));
}

export async function getContentVersion(variantId: string, pageKey: ContentPageKey, versionId: string) {
  await ensureSeedContentVersion(variantId, pageKey);
  return readJsonFile<ContentVersion | null>(contentVersionKey(variantId, pageKey, versionId), null);
}

export async function createContentVersion(
  variantId: string,
  pageKey: ContentPageKey,
  versionName: string,
  payload: ContentVersion["payload"],
) {
  return createVersionRecord(variantId, pageKey, versionName, payload, "draft");
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

export async function cloneContentVersion(variantId: string, pageKey: ContentPageKey, versionId: string) {
  const version = await getContentVersion(variantId, pageKey, versionId);

  if (!version) {
    throw new Error("Content version not found.");
  }

  return createContentVersion(variantId, pageKey, nextClonedVersionName(version.versionName), version.payload);
}

export async function updateContentVersion(
  variantId: string,
  pageKey: ContentPageKey,
  versionId: string,
  updates: Pick<ContentVersion, "versionName" | "payload" | "status">,
) {
  const existing = await getContentVersion(variantId, pageKey, versionId);

  if (!existing) {
    throw new Error("Content version not found.");
  }

  const nextVersion: ContentVersion = {
    ...existing,
    ...updates,
    updatedAt: nowIso(),
  };

  await writeJsonFile(contentVersionKey(variantId, pageKey, versionId), nextVersion);
  const items = await listContentVersions(variantId, pageKey);
  await writeIndex(
    variantId,
    pageKey,
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

export async function getPublication(variantId: string) {
  return readJsonFile<PagePublication>(publicationKey(variantId), {
    variantId,
    activeVersions: {},
    updatedAt: nowIso(),
  });
}

export async function publishContentVersion(variantId: string, pageKey: ContentPageKey, versionId: string) {
  const version = await getContentVersion(variantId, pageKey, versionId);

  if (!version) {
    throw new Error("Content version not found.");
  }

  const publishedVersion = await updateContentVersion(variantId, pageKey, versionId, {
    versionName: version.versionName,
    payload: version.payload,
    status: "published",
  });

  const publication = await getPublication(variantId);
  const nextPublication: PagePublication = {
    ...publication,
    activeVersions: {
      ...publication.activeVersions,
      [pageKey]: publishedVersion.id,
    },
    updatedAt: nowIso(),
  };

  await writeJsonFile(publicationKey(variantId), nextPublication);
  return nextPublication;
}

export async function publishContentPreset(
  variantId: string,
  versionName: string,
  pages: Partial<Record<ContentPageKey, { id?: string; payload: ContentVersion["payload"] }>>,
) {
  const trimmedVersionName = versionName.trim() || "Черновик";
  const activeVersions: Partial<Record<ContentPageKey, string>> = {};
  const versions: Partial<Record<ContentPageKey, ContentVersion>> = {};

  for (const pageKey of contentPageKeys) {
    const page = pages[pageKey];

    if (!page) {
      throw new Error(`Missing content page payload: ${pageKey}.`);
    }

    const version = page.id
      ? await updateContentVersion(variantId, pageKey, page.id, {
          versionName: trimmedVersionName,
          payload: page.payload as never,
          status: "published",
        })
      : await createVersionRecord(variantId, pageKey, trimmedVersionName, page.payload as never, "published");

    activeVersions[pageKey] = version.id;
    versions[pageKey] = version;
  }

  const publication = await getPublication(variantId);
  const nextPublication: PagePublication = {
    ...publication,
    activeVersions: {
      ...publication.activeVersions,
      ...activeVersions,
    },
    updatedAt: nowIso(),
  };

  await writeJsonFile(publicationKey(variantId), nextPublication);
  return {
    publication: nextPublication,
    versions,
  };
}

export async function deleteContentPreset(variantId: string, versionName: string) {
  const trimmedVersionName = versionName.trim();

  if (!trimmedVersionName) {
    throw new Error("Content preset name is required.");
  }

  const publication = await getPublication(variantId);
  const matches: Partial<Record<ContentPageKey, ContentVersionRecord[]>> = {};

  for (const pageKey of contentPageKeys) {
    await ensureSeedContentVersion(variantId, pageKey);
    const index = await readIndex(variantId, pageKey);
    const pageMatches = index.items.filter((item) => item.versionName === trimmedVersionName);

    if (pageMatches.some((item) => publication.activeVersions[pageKey] === item.id)) {
      throw new Error("Cannot delete the active published content preset.");
    }

    matches[pageKey] = pageMatches;
  }

  let deletedCount = 0;
  const deletedByPage: Partial<Record<ContentPageKey, number>> = {};

  for (const pageKey of contentPageKeys) {
    const pageMatches = matches[pageKey] ?? [];

    if (pageMatches.length === 0) {
      deletedByPage[pageKey] = 0;
      continue;
    }

    const index = await readIndex(variantId, pageKey);
    const idsToDelete = new Set(pageMatches.map((item) => item.id));

    await Promise.all(pageMatches.map((item) => deleteJsonFile(contentVersionKey(variantId, pageKey, item.id))));
    await writeIndex(
      variantId,
      pageKey,
      index.items.filter((item) => !idsToDelete.has(item.id)),
    );

    deletedCount += pageMatches.length;
    deletedByPage[pageKey] = pageMatches.length;
  }

  if (deletedCount === 0) {
    throw new Error("Content preset not found.");
  }

  return {
    deletedCount,
    deletedByPage,
  };
}

export async function getPublishedVariantContent(variantId: string, defaults: PublicVariantContent): Promise<PublicVariantContent> {
  const publication = await getPublication(variantId);

  const readPublished = async <P extends ContentPageKey>(pageKey: P, fallback: PublicVariantContent[keyof PublicVariantContent]) => {
    const versionId = publication.activeVersions[pageKey];

    if (!versionId) {
      return fallback;
    }

    const version = await getContentVersion(variantId, pageKey, versionId);
    return (version?.payload ?? fallback) as PublicVariantContent[keyof PublicVariantContent];
  };

  return {
    nav: defaults.nav,
    home: (await readPublished("home", defaults.home)) as PublicVariantContent["home"],
    gallery: (await readPublished("gallery", defaults.gallery)) as PublicVariantContent["gallery"],
    about: (await readPublished("about", defaults.about)) as PublicVariantContent["about"],
    contacts: (await readPublished("contacts", defaults.contacts)) as PublicVariantContent["contacts"],
    detail: (await readPublished("artwork", defaults.detail)) as PublicVariantContent["detail"],
  };
}
