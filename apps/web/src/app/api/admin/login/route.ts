import { NextResponse } from "next/server";

import { createSessionToken, sessionCookieName, sessionCookieOptions, validateAdminCredentials } from "@/server/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const { token, expiresAt } = createSessionToken(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, token, sessionCookieOptions(expiresAt));
  return response;
}
