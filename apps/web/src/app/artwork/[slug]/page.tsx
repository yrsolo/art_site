import Image from "next/image";
import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { getArtworkRepository } from "@/server/repository";
import { getCurrentTheme } from "@/server/theme";
import { artworkMeta, statusLabel } from "@/shared/format";

export const dynamic = "force-dynamic";

type ArtworkPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const repository = getArtworkRepository();
  const [theme, artwork] = await Promise.all([getCurrentTheme(), repository.getBySlug(slug)]);

  if (!artwork || artwork.status === "hidden") {
    notFound();
  }

  return (
    <SiteShell theme={theme} currentPath={`/artwork/${artwork.slug}`} currentThemeId={theme.id}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:items-start">
        <div className={`relative overflow-hidden rounded-[2rem] ${theme.cardClassName}`}>
          <div className="relative aspect-[4/3] w-full">
            <Image src={artwork.imageOriginal} alt={artwork.title} fill className="object-cover" sizes="100vw" priority />
          </div>
        </div>
        <div className={`space-y-6 rounded-[2rem] p-8 ${theme.cardClassName}`}>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Artwork detail</p>
            <h1 className="text-4xl font-semibold">{artwork.title}</h1>
            <p className={`${theme.subtleClassName}`}>{artworkMeta(artwork)}</p>
          </div>
          <p className="text-base leading-8">{artwork.description}</p>
          <div className="grid gap-4 text-sm">
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Status</span>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] ${theme.accentClassName}`}>
                {statusLabel(artwork.status)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Slug</span>
              <span>{artwork.slug}</span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Order</span>
              <span>{artwork.order}</span>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
