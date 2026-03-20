import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { themeCookieName } from "@/features/themes/constants";
import { normalizeThemeId } from "@/server/theme";
import { appConfig } from "@/server/config";

type ThemeRouteProps = {
  params: Promise<{ theme: string }>;
};

export async function GET(request: Request, { params }: ThemeRouteProps) {
  const { theme } = await params;
  const cookieStore = await cookies();
  const nextThemeId = normalizeThemeId(theme);
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";

  cookieStore.set(themeCookieName, nextThemeId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && appConfig.siteUrl.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
