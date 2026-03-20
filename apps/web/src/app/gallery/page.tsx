import { ArtworkCard } from "@/components/artwork-card";
import { SectionTitle } from "@/components/section-title";
import { SiteShell } from "@/components/site-shell";
import { getArtworkRepository } from "@/server/repository";
import { getCurrentTheme } from "@/server/theme";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const repository = getArtworkRepository();
  const [theme, artworks] = await Promise.all([getCurrentTheme(), repository.listPublic()]);

  return (
    <SiteShell theme={theme} currentPath="/gallery" currentThemeId={theme.id}>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Gallery"
          title="Public works ordered from the same local source that powers the admin."
          description="Hidden pieces stay out of the public layer. Available and sold works remain visible and sorted by order."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} theme={theme} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
