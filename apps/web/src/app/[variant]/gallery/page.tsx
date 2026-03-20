import { ColdMistGallery } from "@/components/public/cold-mist";
import { CopperGlowGallery } from "@/components/public/copper-glow";
import { MintRoseGallery } from "@/components/public/mint-rose";
import { VariantArtworkCard } from "@/components/public/variant-artwork-card";
import { VariantShell } from "@/components/public/variant-shell";
import { assertVariantSupportsRoute, getVariantOrThrow } from "@/features/variants";
import { getArtworkRepository } from "@/server/repository";

export const dynamic = "force-dynamic";

type VariantGalleryPageProps = {
  params: Promise<{ variant: string }>;
};

export default async function VariantGalleryPage({ params }: VariantGalleryPageProps) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("gallery", manifest.supportedRoutes);
  const artworks = await getArtworkRepository().listPublic();

  if (manifest.id === "cold-mist") {
    return <ColdMistGallery manifest={manifest} content={content} artworks={artworks} />;
  }

  if (manifest.id === "copper-glow") {
    return <CopperGlowGallery manifest={manifest} content={content} artworks={artworks} />;
  }

  if (manifest.id === "mint-rose") {
    return <MintRoseGallery manifest={manifest} content={content} artworks={artworks} />;
  }

  return (
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
  );
}
