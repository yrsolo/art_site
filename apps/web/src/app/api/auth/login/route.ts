import { NextResponse } from "next/server";

import { createSession, verifyAdminPassword } from "@/server/auth";
import { badRequest, unauthorized } from "@/server/http";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return badRequest("Username and password are required.");
  }

  const settings = await verifyAdminPassword(username, password);

  if (!settings) {
    return unauthorized("Invalid credentials.");
  }

  await createSession(username);

  return NextResponse.json({
    ok: true,
    username,
    passwordIsDefault: settings.passwordIsDefault,
  });
}
