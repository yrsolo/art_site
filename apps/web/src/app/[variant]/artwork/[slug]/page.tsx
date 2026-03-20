import Image from "next/image";
import { notFound } from "next/navigation";

import { ColdMistDetail } from "@/components/public/cold-mist";
import { CopperGlowDetail } from "@/components/public/copper-glow";
import { VariantShell } from "@/components/public/variant-shell";
import { assertVariantSupportsRoute, getVariantOrThrow } from "@/features/variants";
import { getArtworkRepository } from "@/server/repository";
import { artworkMeta, statusLabel } from "@/shared/format";

export const dynamic = "force-dynamic";

type VariantArtworkPageProps = {
  params: Promise<{ variant: string; slug: string }>;
};

export default async function VariantArtworkPage({ params }: VariantArtworkPageProps) {
  const { variant, slug } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("detail", manifest.supportedRoutes);
  const artwork = await getArtworkRepository().getBySlug(slug);

  if (!artwork || artwork.status === "hidden") {
    notFound();
  }

  if (manifest.id === "cold-mist") {
    return <ColdMistDetail manifest={manifest} content={content} artwork={artwork} />;
  }

  if (manifest.id === "copper-glow") {
    const artworks = await getArtworkRepository().listPublic();
    return <CopperGlowDetail manifest={manifest} content={content} artwork={artwork} artworks={artworks} />;
  }

  return (
    <VariantShell manifest={manifest} content={content} currentRoute="detail" slug={artwork.slug}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:items-start">
        <div className={`${manifest.classes.card} ${manifest.classes.pill} overflow-hidden p-4`}>
          <div className={`relative aspect-[4/3] w-full overflow-hidden ${manifest.classes.artworkFrame}`}>
            <Image src={artwork.imageOriginal} alt={artwork.title} fill className="object-cover" sizes="100vw" priority />
          </div>
        </div>
        <div className={`space-y-6 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Artwork detail</p>
            <h1 className="text-4xl font-semibold">{artwork.title}</h1>
            <p className={manifest.classes.subtle}>{artworkMeta(artwork)}</p>
          </div>
          <p className="text-base leading-8">{artwork.description}</p>
          <div className="grid gap-4 text-sm">
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Status</span>
              <span className={`px-3 py-1 text-xs uppercase tracking-[0.15em] ${manifest.classes.accent} ${manifest.classes.pill}`}>
                {statusLabel(artwork.status)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Variant note</span>
              <span className={`max-w-[16rem] text-right ${manifest.classes.subtle}`}>{content.detail.note}</span>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-4">
              <span className="opacity-70">Inquiry</span>
              <span className={`px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
                {content.detail.inquiryLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </VariantShell>
  );
}
