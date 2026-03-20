import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeepImmersionDetail } from "@/components/public/deep-immersion";
import { ColdMistDetail } from "@/components/public/cold-mist";
import { CopperGlowDetail } from "@/components/public/copper-glow";
import { EthericPulseDetail } from "@/components/public/etheric-pulse";
import { MintRoseDetail } from "@/components/public/mint-rose";
import { OliveCreamDetail } from "@/components/public/olive-cream";
import { SageSandDetail } from "@/components/public/sage-sand";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { getPublicArtworkBySlug, listPublicArtworks } from "@/data/artworks";
import { assertVariantSupportsRoute, getVariantOrThrow, listVariants } from "@/features/variants";
import { artworkMeta, statusLabel } from "@/shared/format";

export function generateStaticParams() {
  const artworks = listPublicArtworks();
  return listVariants()
    .filter((variant) => variant.supportedRoutes.includes("detail"))
    .flatMap((variant) => artworks.map((artwork) => ({ variant: variant.id, slug: artwork.slug })));
}

export default async function VariantArtworkPage({ params }: { params: Promise<{ variant: string; slug: string }> }) {
  const { variant, slug } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("detail", manifest.supportedRoutes);
  const artwork = getPublicArtworkBySlug(slug);

  if (!artwork) notFound();

  if (manifest.id === "deep-immersion") return <><DeepImmersionDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "cold-mist") return <><ColdMistDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowDetail manifest={manifest} content={content} artwork={artwork} artworks={listPublicArtworks()} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "mint-rose") return <><MintRoseDetail manifest={manifest} content={content} artwork={artwork} artworks={listPublicArtworks()} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "olive-cream") return <><OliveCreamDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "sage-sand") return <><SageSandDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;

  return (
    <>
      <VariantShell manifest={manifest} content={content} currentRoute="detail">
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
                <span className={`px-3 py-1 text-xs uppercase tracking-[0.15em] ${manifest.classes.accent} ${manifest.classes.pill}`}>{statusLabel(artwork.status)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Variant note</span>
                <span className={`max-w-[16rem] text-right ${manifest.classes.subtle}`}>{content.detail.note}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Inquiry</span>
                <Link href={`/${manifest.id}/contacts`} className={`px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
                  {content.detail.inquiryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </VariantShell>
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} />
    </>
  );
}
