import { NextResponse } from "next/server";

import { getAdminSettings } from "@/server/auth";
import { unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const settings = await getAdminSettings();
  return NextResponse.json({
    username: settings.username,
    passwordIsDefault: settings.passwordIsDefault,
    updatedAt: settings.updatedAt,
  });
}
