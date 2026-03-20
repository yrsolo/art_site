import { NextResponse } from "next/server";

import { clearSession, sessionCookieName, sessionCookieOptions } from "@/server/auth";

export async function POST() {
  await clearSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", sessionCookieOptions(0));
  return response;
}
