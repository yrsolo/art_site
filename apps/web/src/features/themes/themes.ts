import type { SiteTheme, ThemeId } from "@/features/themes/types";

export const siteThemes: SiteTheme[] = [
  {
    id: "dark-atmosphere",
    label: "Dark Atmosphere",
    description: "Moody contrast, bronze glow, gallery-night feeling.",
    bodyClassName: "bg-[#111111] text-[#f4efe7]",
    surfaceClassName: "bg-[#181716] text-[#f4efe7]",
    cardClassName: "border border-white/10 bg-white/5 text-[#f4efe7]",
    accentClassName: "bg-[#b9885b] text-[#1a1613]",
    subtleClassName: "text-[#d4c6b8]",
    heroClassName:
      "bg-[radial-gradient(circle_at_top,_rgba(185,136,91,0.35),_transparent_40%),linear-gradient(135deg,_#111111,_#1d1c1b_55%,_#2c251f)]",
  },
  {
    id: "organic-flow",
    label: "Organic Flow",
    description: "Soft mineral palette with flowing, tactile layouts.",
    bodyClassName: "bg-[#f2ede4] text-[#25302d]",
    surfaceClassName: "bg-[#f8f4ed] text-[#25302d]",
    cardClassName: "border border-[#d7cab7] bg-white/70 text-[#25302d]",
    accentClassName: "bg-[#7a8c69] text-[#f7f3eb]",
    subtleClassName: "text-[#586760]",
    heroClassName:
      "bg-[radial-gradient(circle_at_top_left,_rgba(122,140,105,0.22),_transparent_38%),linear-gradient(145deg,_#f4efe8,_#ebe0cf_58%,_#d9d8c7)]",
  },
  {
    id: "studio-neutral",
    label: "Studio Neutral",
    description: "Clean editorial layout that stays close to the artwork.",
    bodyClassName: "bg-[#f7f3ee] text-[#1f1e1b]",
    surfaceClassName: "bg-white text-[#1f1e1b]",
    cardClassName: "border border-[#e3ddd2] bg-white text-[#1f1e1b]",
    accentClassName: "bg-[#1f1e1b] text-[#f7f3ee]",
    subtleClassName: "text-[#655f55]",
    heroClassName:
      "bg-[radial-gradient(circle_at_bottom_right,_rgba(31,30,27,0.06),_transparent_32%),linear-gradient(140deg,_#faf6f0,_#efe5d8_60%,_#e7ddd2)]",
  },
];

export const defaultThemeId: ThemeId = "organic-flow";

export function isThemeId(value: string): value is ThemeId {
  return siteThemes.some((theme) => theme.id === value);
}

export function getTheme(themeId?: string) {
  if (themeId && isThemeId(themeId)) {
    return siteThemes.find((theme) => theme.id === themeId) ?? siteThemes[0];
  }

  return siteThemes.find((theme) => theme.id === defaultThemeId) ?? siteThemes[0];
}
