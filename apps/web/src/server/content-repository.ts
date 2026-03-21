import type {
  ContentPageKey,
  ContentVersion,
  ContentVersionRecord,
  PagePublication,
  PublicVariantContent,
} from "@/features/content/types";
import { appConfig } from "@/server/config";
import { readJsonFile, writeJsonFile } from "@/server/json-store";
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

export async function listContentVersions(variantId: string, pageKey: ContentPageKey) {
  const index = await readIndex(variantId, pageKey);
  return index.items;
}

export async function getContentVersion(variantId: string, pageKey: ContentPageKey, versionId: string) {
  return readJsonFile<ContentVersion | null>(contentVersionKey(variantId, pageKey, versionId), null);
}

export async function createContentVersion(
  variantId: string,
  pageKey: ContentPageKey,
  versionName: string,
  payload: ContentVersion["payload"],
) {
  const timestamp = nowIso();
  const version: ContentVersion = {
    id: newId(),
    variantId,
    pageKey,
    versionName,
    status: "draft",
    payload,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeJsonFile(contentVersionKey(variantId, pageKey, version.id), version);
  const items = await listContentVersions(variantId, pageKey);
  items.unshift({
    id: version.id,
    versionName: version.versionName,
    status: version.status,
    updatedAt: version.updatedAt,
  });
  await writeIndex(variantId, pageKey, items);
  return version;
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
        ? { id: versionId, versionName: nextVersion.versionName, status: nextVersion.status, updatedAt: nextVersion.updatedAt }
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
