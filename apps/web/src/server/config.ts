import path from "node:path";

function env(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const inferredMode =
  process.env.OBJECT_STORAGE_MODE ?? (process.env.AWS_ACCESS_KEY_ID && process.env.OBJECT_STORAGE_BUCKET ? "s3" : "local");

function splitOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export const appConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  adminBaseUrl: process.env.NEXT_PUBLIC_ADMIN_BASE_URL ?? "http://localhost:3001",
  storageMode: inferredMode as "local" | "s3",
  sessionSecret: env("SESSION_SIGNING_SECRET", process.env.SESSION_SECRET ?? "change-me-long-random-string"),
  cookieName: process.env.COOKIE_NAME ?? "art-site-session",
  cookieSecure: (process.env.COOKIE_SECURE ?? "false").toLowerCase() === "true",
  cookieSameSite: (process.env.COOKIE_SAMESITE ?? "Lax").toLowerCase() as "lax" | "strict" | "none",
  cookiePath: process.env.COOKIE_PATH ?? "/",
  cookieDomain: process.env.COOKIE_DOMAIN ?? undefined,
  sessionTtlSeconds: Number(process.env.SESSION_TTL_SECONDS ?? 60 * 60 * 24 * 30),
  bootstrapAdminUsername: "admin",
  bootstrapAdminPassword: process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "333",
  objectStorageEndpoint: process.env.OBJECT_STORAGE_ENDPOINT ?? "https://storage.yandexcloud.net",
  objectStorageRegion: process.env.OBJECT_STORAGE_REGION ?? "ru-central1",
  objectStorageBucket: env("OBJECT_STORAGE_BUCKET", "art-site"),
  objectStorageAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  objectStorageSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  dataPrefix: process.env.OBJECT_STORAGE_DATA_PREFIX ?? "private/data",
  mediaPrefix: process.env.OBJECT_STORAGE_MEDIA_PREFIX ?? "media",
  publicSnapshotPrefix: process.env.OBJECT_STORAGE_PUBLIC_SNAPSHOT_PREFIX ?? "private/data/export",
  publicSiteSnapshotKey: process.env.PUBLIC_SITE_SNAPSHOT_KEY ?? "public-site.json",
  localRuntimeRoot: process.env.LOCAL_RUNTIME_ROOT ?? path.join(process.cwd(), ".runtime-storage"),
  localPublicSnapshotFile:
    process.env.LOCAL_PUBLIC_SNAPSHOT_FILE ?? path.join(process.cwd(), ".runtime-storage", "export", "public-site.json"),
  localMediaRoot: process.env.LOCAL_MEDIA_ROOT ?? path.join(process.cwd(), "public", "uploads"),
  allowedOrigins: Array.from(
    new Set(
      splitOrigins(process.env.ADMIN_ALLOWED_ORIGINS).concat([
        process.env.NEXT_PUBLIC_ADMIN_BASE_URL ?? "http://localhost:3001",
        "http://localhost:3001",
      ]),
    ),
  ),
};
