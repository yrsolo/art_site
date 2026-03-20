import Link from "next/link";

import { DeepImmersionHome } from "@/components/public/deep-immersion";
import { ColdMistHome } from "@/components/public/cold-mist";
import { CopperGlowHome } from "@/components/public/copper-glow";
import { EthericPulseHome } from "@/components/public/etheric-pulse";
import { MintRoseHome } from "@/components/public/mint-rose";
import { OliveCreamHome } from "@/components/public/olive-cream";
import { SageSandHome } from "@/components/public/sage-sand";
import { VariantArtworkCard } from "@/components/public/variant-artwork-card";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { listPublicArtworks } from "@/data/artworks";
import { getVariantOrThrow, listVariants } from "@/features/variants";

export function generateStaticParams() {
  return listVariants().map((variant) => ({ variant: variant.id }));
}

export default async function VariantHomePage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  const artworks = listPublicArtworks();
  const featured = artworks.slice(0, 3);

  if (manifest.id === "deep-immersion") return <><DeepImmersionHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "cold-mist") return <><ColdMistHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "mint-rose") return <><MintRoseHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "olive-cream") return <><OliveCreamHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
  if (manifest.id === "sage-sand") return <><SageSandHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;

  return (
    <>
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
          </div>
        }
      >
        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Selected works</p>
            <h2 className="text-3xl font-semibold md:text-5xl">Preview the frontend face without losing shared content continuity.</h2>
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
            <Link href={`/${manifest.id}/${manifest.supportedRoutes.includes("about") ? "about" : "contacts"}`} className={`border px-5 py-3 text-sm font-medium ${manifest.classes.pill}`}>
              {content.home.secondaryCta}
            </Link>
          </div>
        </section>
      </VariantShell>
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="home" />
    </>
  );
}
