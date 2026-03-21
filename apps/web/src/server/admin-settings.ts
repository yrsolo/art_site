import crypto from "node:crypto";

import { appConfig } from "@/server/config";
import { readJsonFile, writeJsonFile } from "@/server/json-store";
import { nowIso } from "@/server/utils";

const settingsKey = `${appConfig.dataPrefix}/admin/settings.json`;

export type AdminSettings = {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  passwordIsDefault: boolean;
  updatedAt: string;
};

async function hashPassword(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Buffer.from(derivedKey).toString("hex"));
    });
  });
}

async function createSettings(password: string, passwordIsDefault: boolean): Promise<AdminSettings> {
  const salt = crypto.randomBytes(16).toString("hex");

  return {
    username: appConfig.bootstrapAdminUsername,
    passwordSalt: salt,
    passwordHash: await hashPassword(password, salt),
    passwordIsDefault,
    updatedAt: nowIso(),
  };
}

export async function getAdminSettings() {
  const existing = await readJsonFile<AdminSettings | null>(settingsKey, null);

  if (existing) {
    return existing;
  }

  const bootstrap = await createSettings(appConfig.bootstrapAdminPassword, true);
  await writeJsonFile(settingsKey, bootstrap);
  return bootstrap;
}

export async function verifyAdminPassword(username: string, password: string) {
  const settings = await getAdminSettings();

  if (username !== settings.username) {
    return null;
  }

  const hashed = await hashPassword(password, settings.passwordSalt);

  if (hashed !== settings.passwordHash) {
    return null;
  }

  return settings;
}

export async function updateAdminPassword(nextPassword: string) {
  const settings = await createSettings(nextPassword, false);
  await writeJsonFile(settingsKey, settings);
  return settings;
}
