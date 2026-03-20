import { ColdMistGallery } from "@/components/public/cold-mist";
import { CopperGlowGallery } from "@/components/public/copper-glow";
import { EthericPulseGallery } from "@/components/public/etheric-pulse";
import { MintRoseGallery } from "@/components/public/mint-rose";
import { OliveCreamGallery } from "@/components/public/olive-cream";
import { SageSandGallery } from "@/components/public/sage-sand";
import { VariantArtworkCard } from "@/components/public/variant-artwork-card";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { listPublicArtworks } from "@/data/artworks";
import { assertVariantSupportsRoute, getVariantOrThrow, listVariants } from "@/features/variants";

export function generateStaticParams() {
  return listVariants().filter((variant) => variant.supportedRoutes.includes("gallery")).map((variant) => ({ variant: variant.id }));
}

export default async function VariantGalleryPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("gallery", manifest.supportedRoutes);
  const artworks = listPublicArtworks();

  if (manifest.id === "cold-mist") return <><ColdMistGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
  if (manifest.id === "mint-rose") return <><MintRoseGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
  if (manifest.id === "olive-cream") return <><OliveCreamGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
  if (manifest.id === "sage-sand") return <><SageSandGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;

  return (
    <>
      <VariantShell manifest={manifest} content={content} currentRoute="gallery">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.gallery.eyebrow}</p>
            <h1 className="text-3xl font-semibold md:text-5xl">{content.gallery.title}</h1>
            <p className={`max-w-3xl text-base ${manifest.classes.subtle}`}>{content.gallery.description}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {artworks.map((artwork) => (
              <VariantArtworkCard key={artwork.id} variant={manifest} artwork={artwork} />
            ))}
          </div>
        </div>
      </VariantShell>
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" />
    </>
  );
}
