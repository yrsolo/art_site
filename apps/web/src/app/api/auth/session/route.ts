import { NextResponse } from "next/server";

import { getAdminSettings, getSession } from "@/server/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const settings = await getAdminSettings();

  return NextResponse.json({
    authenticated: true,
    username: session.username,
    passwordIsDefault: settings.passwordIsDefault,
  });
}
