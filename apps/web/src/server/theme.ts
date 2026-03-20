import { cookies } from "next/headers";

import { themeCookieName } from "@/features/themes/constants";
import { defaultThemeId, getTheme, isThemeId } from "@/features/themes/themes";

export async function getCurrentTheme() {
  const cookieStore = await cookies();
  const themeId = cookieStore.get(themeCookieName)?.value;
  return getTheme(themeId);
}

export function normalizeThemeId(themeId?: string) {
  return themeId && isThemeId(themeId) ? themeId : defaultThemeId;
}
