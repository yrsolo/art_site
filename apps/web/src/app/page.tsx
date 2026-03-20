import Link from "next/link";

import { ArtworkCard } from "@/components/artwork-card";
import { SectionTitle } from "@/components/section-title";
import { SiteShell } from "@/components/site-shell";
import { getArtworkRepository } from "@/server/repository";
import { getCurrentTheme } from "@/server/theme";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const repository = getArtworkRepository();
  const [theme, artworks] = await Promise.all([getCurrentTheme(), repository.listPublic()]);
  const featured = artworks.slice(0, 3);

  return (
    <SiteShell
      theme={theme}
      currentPath="/"
      currentThemeId={theme.id}
      hero={
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-18 md:py-24 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] opacity-70">Painter portfolio</p>
            <h1 className="text-5xl font-semibold leading-none md:text-7xl">
              A local-first gallery MVP that keeps the artwork at the center.
            </h1>
            <p className={`max-w-2xl text-lg ${theme.subtleClassName}`}>
              This first version supports multiple visual directions, a public gallery, detailed artwork pages,
              and a simple private admin panel powered by local JSON and local uploads.
            </p>
          </div>
          <div className={`max-w-sm rounded-[2rem] p-6 ${theme.cardClassName}`}>
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">Current direction</p>
            <p className="mt-3 text-2xl font-semibold">{theme.label}</p>
            <p className={`mt-3 text-sm ${theme.subtleClassName}`}>{theme.description}</p>
          </div>
        </div>
      }
    >
      <section className="space-y-8">
        <SectionTitle
          eyebrow="Selected works"
          title="A calm, intentional first pass for the artist's public portfolio."
          description="The public layer is already reading from the same local repository as the admin, so the next iterations can focus on content and polish instead of restructuring."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} theme={theme} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/gallery" className={`rounded-full px-5 py-3 text-sm font-medium ${theme.accentClassName}`}>
            Open gallery
          </Link>
          <Link href="/admin" className={`rounded-full border px-5 py-3 text-sm font-medium ${theme.cardClassName}`}>
            Open admin
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
