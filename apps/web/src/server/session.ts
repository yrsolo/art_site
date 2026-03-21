import crypto from "node:crypto";

import { cookies } from "next/headers";

import { appConfig } from "@/server/config";

export type SessionPayload = {
  username: string;
  expiresAt: number;
};

function sign(value: string) {
  return crypto.createHmac("sha256", appConfig.sessionSecret).update(value).digest("hex");
}

function encode(payload: SessionPayload) {
  const base = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${base}.${sign(base)}`;
}

function decode(token: string) {
  const [base, signature] = token.split(".");

  if (!base || !signature || sign(base) !== signature) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf8")) as SessionPayload;

  if (payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
}

export async function createSession(username: string) {
  const expiresAt = Date.now() + appConfig.sessionTtlSeconds * 1000;
  const token = encode({ username, expiresAt });
  const store = await cookies();

  store.set(appConfig.cookieName, token, {
    httpOnly: true,
    sameSite: appConfig.cookieSameSite,
    secure: appConfig.cookieSecure,
    path: appConfig.cookiePath,
    expires: new Date(expiresAt),
  });
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(appConfig.cookieName)?.value;
  return token ? decode(token) : null;
}

export async function clearSession() {
  const store = await cookies();
  store.delete(appConfig.cookieName);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
