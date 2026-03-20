export type ThemeId = "dark-atmosphere" | "organic-flow" | "studio-neutral";

export type SiteTheme = {
  id: ThemeId;
  label: string;
  description: string;
  bodyClassName: string;
  surfaceClassName: string;
  cardClassName: string;
  accentClassName: string;
  subtleClassName: string;
  heroClassName: string;
};
