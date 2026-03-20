import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { VariantSwitcher } from "@/components/public/variant-switcher";
import type { Artwork } from "@/features/artworks/types";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { templateMedia } from "@/features/variants/template-media";

type MintRoseLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
  slug?: string;
};

type MintRosePageProps = {
  manifest: VariantManifest;
  content: VariantContent;
};

type MintRoseGalleryProps = MintRosePageProps & {
  artworks: Artwork[];
};

type MintRoseDetailProps = MintRosePageProps & {
  artwork: Artwork;
  artworks: Artwork[];
};

const organicShapes = [
  "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]",
  "rounded-[60%_40%_30%_70%/50%_60%_50%_40%]",
  "rounded-[50%_50%_60%_40%/40%_60%_50%_50%]",
  "rounded-[30%_70%_50%_50%/60%_40%_60%_40%]",
  "rounded-[70%_30%_40%_60%/50%_50%_40%_60%]",
];

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "contacts" as const, href: `${basePath}/contacts`, label: content.nav.contacts },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function MintRoseLayout({ manifest, content, currentRoute, children, slug }: MintRoseLayoutProps) {
  const navItems = buildNavItems(manifest, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f9ecec] text-[#4a403a] selection:bg-[#98d8c8]/40 selection:text-[#30423b]">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-[#98d8c8]/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#e8a5a5]/20 blur-3xl" />

      <header className="relative z-20 mx-auto max-w-[1200px] px-4 pb-8 pt-5 md:px-10 lg:px-16">
        <div className="mb-10 flex items-center justify-between rounded-full bg-[rgba(255,245,245,0.6)] px-4 py-6 shadow-[0_20px_40px_rgba(74,64,58,0.05)] backdrop-blur-xl md:px-10 md:mb-20">
          <div className="flex items-center gap-4">
            <div className="grid h-6 w-6 place-items-center text-[#13ecb6]">✦</div>
            <Link href={`/${manifest.id}`} className="font-serif text-xl font-bold tracking-[-0.02em] text-[#4a403a]">
              Mint &amp; Rose
            </Link>
          </div>

          <nav className="hidden items-center gap-9 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-light transition-colors ${
                  currentRoute === item.key
                    ? "text-[#4a403a] after:block after:h-0.5 after:w-full after:bg-[#13ecb6] after:content-['']"
                    : "text-[#bcaaa4] hover:text-[#4a403a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <VariantSwitcher currentVariantId={manifest.id} currentRoute={currentRoute} slug={slug} />
            <span className="md:hidden">MENU</span>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}

export function MintRoseHome({ manifest, content, artworks }: MintRoseGalleryProps) {
  const heroArtwork = artworks[0];

  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="home">
      <section className="mx-auto max-w-[1200px] px-4 pb-20 md:px-10 lg:px-16">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-20">
          <div className="z-10 flex flex-col gap-8 text-center lg:w-1/2 lg:text-left">
            <div className="flex flex-col gap-6">
              <h1 className="font-serif text-5xl italic leading-tight tracking-[-0.04em] md:text-6xl lg:text-[64px]">
                Emotions in Pigment
              </h1>
              <p className="mx-auto max-w-lg text-lg font-light leading-relaxed text-[#4a403a]/80 lg:mx-0">{content.home.description}</p>
            </div>
            <div className="flex justify-center pt-4 lg:justify-start">
              <Link
                href={`/${manifest.id}/gallery`}
                className="group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#13ecb6] px-8 py-4 text-base uppercase tracking-[0.125em] text-[#10221d] transition-all duration-300 hover:bg-[#e2f2ef] hover:text-[#13ecb6] hover:shadow-[0_0_30px_rgba(19,236,182,0.4)]"
              >
                View Collection
                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">--&gt;</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[500px] justify-center lg:w-1/2 lg:max-w-none lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-h-[700px] md:aspect-square lg:aspect-[4/5]">
              <div className="absolute inset-0 translate-x-4 translate-y-4 animate-pulse rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#13ecb6]/30 blur-2xl opacity-60" />
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-white/40 bg-[rgba(255,245,245,0.6)] shadow-[0_20px_40px_rgba(74,64,58,0.15)] backdrop-blur-xl">
                {heroArtwork ? (
                  <Image
                    src={templateMedia.mintRose.hero}
                    alt={heroArtwork.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-[#13ecb6]/30" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border border-[#4a403a]/10" />
            </div>
          </div>
        </div>
      </section>
    </MintRoseLayout>
  );
}

export function MintRoseGallery({ manifest, content, artworks }: MintRoseGalleryProps) {
  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
        <div className="mb-12">
          <p className="font-serif text-[32px] italic text-[#4a403a] md:text-[48px]">Exhibition Space</p>
          <p className="text-lg text-[#bcaaa4]">A collection of organic, fluid abstractions.</p>
        </div>

        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {artworks.map((artwork, index) => {
            const shape = organicShapes[index % organicShapes.length];
            const height =
              index % 6 === 0 ? "h-[400px]" : index % 6 === 1 ? "h-[500px]" : index % 6 === 2 ? "h-[350px]" : index % 6 === 3 ? "h-[450px]" : index % 6 === 4 ? "h-[300px]" : "h-[480px]";

            return (
              <Link key={artwork.id} href={`/${manifest.id}/artwork/${artwork.slug}`} className={`group relative mb-8 block break-inside-avoid overflow-hidden bg-white/50 shadow-[0_20px_40px_rgba(74,64,58,0.05)] ${shape} ${height}`}>
                <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center bg-[#13ecb6]/40 p-8 text-center opacity-0 backdrop-blur-xl transition-opacity duration-500 group-hover:opacity-100">
                  <h3 className="font-serif text-3xl italic text-white drop-shadow-md">{artwork.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </MintRoseLayout>
  );
}

export function MintRoseDetail({ manifest, content, artwork, artworks }: MintRoseDetailProps) {
  const detailShots = artworks.filter((item) => item.id !== artwork.id).slice(0, 2);

  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="detail" slug={artwork.slug}>
      <section className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-12 lg:gap-24 lg:px-12 lg:py-20">
        <div className="relative lg:col-span-7">
          <div className="group sticky top-12">
            <div className="rounded-xl border border-slate-100 bg-white/50 p-3 shadow-sm">
              <Image
                src={artwork.imageOriginal}
                alt={artwork.title}
                width={1400}
                height={1800}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="h-[614px] w-full rounded-lg object-cover lg:h-[819px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col pt-4 lg:col-span-5 lg:pt-10">
          <h1 className="mb-6 text-4xl font-light tracking-tight text-slate-900 md:text-5xl lg:text-6xl">{artwork.title}</h1>
          <div className="mb-10 flex flex-col gap-2 font-medium tracking-wide text-slate-500">
            <p>{artwork.medium}</p>
            <p>{artwork.size}</p>
            <p>{artwork.year}</p>
          </div>
          <div className="prose prose-lg mb-12 max-w-none font-light leading-relaxed text-slate-700">
            <p>{artwork.description}</p>
          </div>
          <Link
            href={`/${manifest.id}/contacts`}
            className="mb-20 block w-full rounded-full bg-[#13ecb6] py-5 text-center text-lg font-bold text-[#10221d] shadow-lg transition-colors hover:bg-[#13ecb6]/90"
          >
            {content.detail.inquiryLabel}
          </Link>

          <div className="space-y-8">
            <h3 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Texture &amp; Detail</h3>
            <div className="grid grid-cols-2 items-start gap-6">
              {detailShots[0] ? (
                <div className="mt-12">
                  <Image
                    src={detailShots[0].imagePreview}
                    alt={detailShots[0].title}
                    width={600}
                    height={800}
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="aspect-[3/4] w-full rounded-lg border border-slate-100 object-cover shadow-md"
                  />
                </div>
              ) : null}
              {detailShots[1] ? (
                <div>
                  <Image
                    src={detailShots[1].imagePreview}
                    alt={detailShots[1].title}
                    width={600}
                    height={600}
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="aspect-square w-full rounded-lg border border-slate-100 object-cover shadow-md"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </MintRoseLayout>
  );
}
