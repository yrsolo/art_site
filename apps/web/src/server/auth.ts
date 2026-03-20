import crypto from "node:crypto";

import { cookies } from "next/headers";

import type { SessionPayload } from "@/features/auth/types";
import { appConfig } from "@/server/config";

export const sessionCookieName = "art-site-session";
const sessionLifetimeMs = 1000 * 60 * 60 * 24 * 7;

function sign(value: string) {
  return crypto.createHmac("sha256", appConfig.sessionSecret).update(value).digest("hex");
}

function encode(payload: SessionPayload) {
  const json = JSON.stringify(payload);
  const base = Buffer.from(json, "utf8").toString("base64url");
  return `${base}.${sign(base)}`;
}

export function createSessionToken(username: string) {
  const expiresAt = Date.now() + sessionLifetimeMs;
  const token = encode({ username, expiresAt });

  return {
    token,
    expiresAt,
  };
}

export function sessionCookieOptions(expiresAt: number) {
  const secureCookie =
    process.env.NODE_ENV === "production" && appConfig.siteUrl.startsWith("https://");

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: secureCookie,
    path: "/",
    expires: new Date(expiresAt),
  };
}

function decode(token: string): SessionPayload | null {
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
  const cookieStore = await cookies();
  const { token, expiresAt } = createSessionToken(username);
  cookieStore.set(sessionCookieName, token, sessionCookieOptions(expiresAt));
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(sessionCookieName)?.value;
  return raw ? decode(raw) : null;
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export function validateAdminCredentials(username: string, password: string) {
  return username === appConfig.adminUsername && password === appConfig.adminPassword;
}
