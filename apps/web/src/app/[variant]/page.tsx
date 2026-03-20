import Link from "next/link";

import { ColdMistHome } from "@/components/public/cold-mist";
import { CopperGlowHome } from "@/components/public/copper-glow";
import { VariantArtworkCard } from "@/components/public/variant-artwork-card";
import { VariantShell } from "@/components/public/variant-shell";
import { getVariantOrThrow } from "@/features/variants";
import { getArtworkRepository } from "@/server/repository";

export const dynamic = "force-dynamic";

type VariantPageProps = {
  params: Promise<{ variant: string }>;
};

export default async function VariantHomePage({ params }: VariantPageProps) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  const artworks = await getArtworkRepository().listPublic();
  const featured = artworks.slice(0, 3);

  if (manifest.id === "cold-mist") {
    return <ColdMistHome manifest={manifest} content={content} artworks={artworks} />;
  }

  if (manifest.id === "copper-glow") {
    return <CopperGlowHome manifest={manifest} content={content} artworks={artworks} />;
  }

  return (
    <VariantShell
      manifest={manifest}
      content={content}
      currentRoute="home"
      hero={
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-18 md:py-24 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] opacity-70">{content.home.eyebrow}</p>
            <h1 className="text-5xl font-semibold leading-none md:text-7xl">{content.home.title}</h1>
            <p className={`max-w-2xl text-lg ${manifest.classes.subtle}`}>{content.home.description}</p>
          </div>
          <div className={`max-w-sm p-6 ${manifest.classes.card} ${manifest.classes.pill}`}>
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">North star</p>
            <p className="mt-3 text-2xl font-semibold">{manifest.northStar}</p>
            <p className={`mt-3 text-sm ${manifest.classes.subtle}`}>{manifest.summary}</p>
          </div>
        </div>
      }
    >
      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] opacity-70">Selected works</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Preview the frontend face without losing backend continuity.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((artwork) => (
            <VariantArtworkCard key={artwork.id} variant={manifest} artwork={artwork} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href={`/${manifest.id}/gallery`} className={`px-5 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
            {content.home.primaryCta}
          </Link>
          {manifest.supportedRoutes.includes("about") ? (
            <Link href={`/${manifest.id}/about`} className={`border px-5 py-3 text-sm font-medium ${manifest.classes.pill}`}>
              {content.home.secondaryCta}
            </Link>
          ) : (
            <Link href={`/${manifest.id}/contacts`} className={`border px-5 py-3 text-sm font-medium ${manifest.classes.pill}`}>
              {content.home.secondaryCta}
            </Link>
          )}
        </div>
      </section>
    </VariantShell>
  );
}
