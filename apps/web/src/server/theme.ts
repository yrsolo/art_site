import { cookies } from "next/headers";

import { defaultThemeId, getTheme, isThemeId } from "@/features/themes/themes";

export const themeCookieName = "art-site-theme";

export async function getCurrentTheme() {
  const cookieStore = await cookies();
  const themeId = cookieStore.get(themeCookieName)?.value;
  return getTheme(themeId);
}

export function normalizeThemeId(themeId?: string) {
  return themeId && isThemeId(themeId) ? themeId : defaultThemeId;
}
