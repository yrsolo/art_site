import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { themeCookieName } from "@/features/themes/constants";
import { appConfig } from "@/server/config";
import { normalizeThemeId } from "@/server/theme";

export async function POST(request: Request) {
  const body = (await request.json()) as { themeId?: string };
  const themeId = normalizeThemeId(body.themeId);
  const cookieStore = await cookies();

  cookieStore.set(themeCookieName, themeId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && appConfig.siteUrl.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ ok: true, themeId });
}
