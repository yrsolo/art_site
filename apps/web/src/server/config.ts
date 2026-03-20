import path from "node:path";

function requiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const appConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "localhost",
  adminUsername: requiredEnv("ADMIN_USERNAME", "admin"),
  adminPassword: requiredEnv("ADMIN_PASSWORD", "change-me"),
  sessionSecret: requiredEnv("SESSION_SECRET", "change-me-long-random-string"),
  artworksDataFile:
    process.env.ARTWORKS_DATA_FILE ?? path.join(process.cwd(), "data", "artworks.json"),
  uploadsDirectory: path.join(process.cwd(), "public", "uploads"),
};
