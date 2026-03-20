import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { VariantSwitcher } from "@/components/public/variant-switcher";
import type { Artwork } from "@/features/artworks/types";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { templateMedia } from "@/features/variants/template-media";
import { statusLabel } from "@/shared/format";

type CopperGlowLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
  slug?: string;
};

type CopperGlowPageProps = {
  manifest: VariantManifest;
  content: VariantContent;
};

type CopperGlowGalleryProps = CopperGlowPageProps & {
  artworks: Artwork[];
};

type CopperGlowDetailProps = CopperGlowPageProps & {
  artwork: Artwork;
  artworks: Artwork[];
};

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "about" as const, href: `${basePath}/about`, label: content.nav.about },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function CopperGlowLayout({ manifest, content, currentRoute, children, slug }: CopperGlowLayoutProps) {
  const navItems = buildNavItems(manifest, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#11131a] text-[#e1e2eb] selection:bg-[#e8be9f] selection:text-[#442b14]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_60%_50%,_rgba(140,106,79,0.16),_transparent_58%)]" />

      <header className="fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between px-6 py-6 md:px-8">
          <Link href={`/${manifest.id}`} className="font-[family-name:var(--font-geist-sans)] text-2xl font-black uppercase tracking-[-0.08em] text-[#e8be9f]">
            AURUM
          </Link>

          <nav className="hidden items-center gap-12 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-[family-name:var(--font-geist-sans)] text-sm font-medium uppercase tracking-tight transition-colors ${
                  currentRoute === item.key
                    ? "border-b-2 border-[#e8be9f] pb-1 text-[#e8be9f]"
                    : "text-[#aab6c9] hover:text-[#e8be9f]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <VariantSwitcher currentVariantId={manifest.id} currentRoute={currentRoute} slug={slug} />
            <span className="grid h-10 w-10 place-items-center text-[#e8be9f] transition-all duration-300 hover:bg-[#8c6a4f]/20">MENU</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[#4f453d]/10 bg-[#11131a]/80 backdrop-blur-2xl md:hidden">
        <Link href={`/${manifest.id}`} className={`flex w-full flex-col items-center justify-center p-2 ${currentRoute === "home" ? "bg-[#8c6a4f]/20 text-[#e8be9f]" : "text-[#3c4758]"}`}>
          <span className="text-[10px] uppercase tracking-[0.22em]">Home</span>
        </Link>
        <Link href={`/${manifest.id}/gallery`} className={`flex w-full flex-col items-center justify-center p-2 ${currentRoute === "gallery" ? "bg-[#8c6a4f]/20 text-[#e8be9f]" : "text-[#3c4758]"}`}>
          <span className="text-[10px] uppercase tracking-[0.22em]">Gallery</span>
        </Link>
        <Link href={`/${manifest.id}/contacts`} className={`flex w-full flex-col items-center justify-center p-2 ${currentRoute === "detail" || currentRoute === "contacts" ? "bg-[#8c6a4f]/20 text-[#e8be9f]" : "text-[#3c4758]"}`}>
          <span className="text-[10px] uppercase tracking-[0.22em]">Detail</span>
        </Link>
      </nav>
    </div>
  );
}

export function CopperGlowHome({ manifest, content, artworks }: CopperGlowGalleryProps) {
  const heroArtwork = artworks[1] ?? artworks[0];
  const featureArtwork = artworks[2] ?? artworks[0];
  const sculpturalArtwork = artworks[3] ?? heroArtwork;

  return (
    <CopperGlowLayout manifest={manifest} content={content} currentRoute="home">
      <section className="relative flex min-h-screen flex-col items-center overflow-hidden md:flex-row">
        <div className="w-full px-8 pt-32 md:w-[40%] md:pl-24 md:pt-0">
          <h1 className="font-[family-name:var(--font-geist-sans)] text-6xl font-black uppercase leading-[0.9] tracking-[-0.07em] text-[#e1e2eb] md:text-8xl lg:text-9xl">
            Form.
            <br />
            Color.
            <br />
            <span className="text-[#e8be9f]">Void.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[#d3c4b9]">{content.home.description}</p>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row">
            <Link href={`/${manifest.id}/gallery`} className="bg-[#e8be9f] px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#442b14] transition-all hover:brightness-110 active:scale-95">
              Explore Archive
            </Link>
            <Link href={`/${manifest.id}/about`} className="border border-[#4f453d]/30 px-10 py-4 text-sm uppercase tracking-[0.2em] text-[#e1e2eb] transition-all hover:bg-[#282a31] active:scale-95">
              The Manifesto
            </Link>
          </div>
        </div>

        <div className="relative mt-12 flex h-[32rem] w-full items-center md:mt-0 md:h-screen md:w-[60%]">
          {heroArtwork ? (
            <div className="absolute right-0 h-full w-[120%] translate-x-20 md:translate-x-32">
              <Image
                src={templateMedia.copperGlow.hero}
                alt={heroArtwork.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover brightness-75 grayscale shadow-2xl transition-all duration-1000 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#11131a] via-transparent to-transparent" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#191b22] px-8 py-24 md:px-24">
        <div className="mx-auto max-w-[96rem]">
          <div className="mb-16">
            <span className="text-xs uppercase tracking-[0.22em] text-[#e8be9f]">The Vision</span>
            <h2 className="mt-4 font-[family-name:var(--font-geist-sans)] text-4xl font-black uppercase tracking-[-0.06em] md:text-6xl">Curation of Matter</h2>
          </div>

          <div className="grid h-auto grid-cols-1 gap-8 md:h-[600px] md:grid-cols-3">
            <div className="group relative overflow-hidden bg-[#1d1f26] md:col-span-2">
              {featureArtwork ? (
                <Image
                  src={templateMedia.copperGlow.feature}
                  alt={featureArtwork.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl font-black uppercase tracking-[-0.05em]">Tactile Resonance</h3>
                <p className="mt-2 max-w-lg text-[#d3c4b9]">
                  The intersection of physical texture and digital void, exploring the boundaries of sensory perception.
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col gap-8">
              <div className="flex flex-1 flex-col justify-end border-l-2 border-[#e8be9f] bg-[#8c6a4f]/10 p-10">
                <span className="mb-4 text-[#e8be9f]">ARC</span>
                <h3 className="font-[family-name:var(--font-geist-sans)] text-xl font-black uppercase tracking-[-0.04em]">Brutalist Form</h3>
                <p className="mt-2 text-sm text-[#d3c4b9]">Precision meets raw materiality in every architectural curve.</p>
              </div>
              <div className="flex flex-1 flex-col justify-end bg-[#282a31] p-10">
                <span className="mb-4 text-[#e8be9f]">GLOW</span>
                <h3 className="font-[family-name:var(--font-geist-sans)] text-xl font-black uppercase tracking-[-0.04em]">Atmospheric Depth</h3>
                <p className="mt-2 text-sm text-[#d3c4b9]">Lighting as a structural element, defining space through shadow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-20 px-8 py-32 md:flex-row md:px-24">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[#8c6a4f]/20 blur-3xl" />
            {sculpturalArtwork ? (
              <Image
                src={templateMedia.copperGlow.sculptural}
                alt={sculpturalArtwork.title}
                width={1200}
                height={1400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="relative z-10 h-auto w-full border-r-[20px] border-[#8c6a4f]/30 object-cover grayscale contrast-125"
              />
            ) : null}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="mb-8 font-[family-name:var(--font-geist-sans)] text-5xl font-black uppercase leading-tight tracking-[-0.06em]">
            Refracted
            <br />
            Persistence
          </h2>
          <div className="space-y-6 text-lg text-[#d3c4b9]">
            <p>
              Every piece in the Copper Glow collection is an experiment in temporal decay. We explore how light interacts with
              oxidizing surfaces, creating a bridge between the permanent and the ephemeral.
            </p>
            <p>Experience the curated collection in high fidelity, where every pixel is tuned to the frequency of the alchemist.</p>
          </div>
          <div className="mt-12">
            <Link href={`/${manifest.id}/gallery`} className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] text-[#e8be9f] transition-all hover:gap-6">
              View Full Collection
              <span>--&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </CopperGlowLayout>
  );
}

export function CopperGlowGallery({ manifest, content, artworks }: CopperGlowGalleryProps) {
  return (
    <CopperGlowLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="mx-auto max-w-[96rem] px-8 pb-24 pt-10">
        <header className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h1 className="mb-6 font-[family-name:var(--font-geist-sans)] text-6xl font-black uppercase leading-none tracking-[-0.06em] text-[#e8be9f] md:text-8xl">
              Curated
              <br />
              Visions
            </h1>
            <p className="max-w-md text-lg text-[#d3c4b9]">
              Explore the intersection of structural rigidity and atmospheric warmth. A collection curated for the Cinematic
              Alchemist.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 self-start md:self-end">
            <span className="mr-2 text-xs uppercase tracking-[0.22em] text-[#e8be9f]">Filter By:</span>
            <button className="bg-[#e8be9f] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#442b14]">All Works</button>
            <button className="bg-[#282a31] px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#e1e2eb] transition-colors hover:bg-[#3c4758]">Architecture</button>
            <button className="bg-[#282a31] px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#e1e2eb] transition-colors hover:bg-[#3c4758]">Digital Art</button>
            <button className="bg-[#282a31] px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#e1e2eb] transition-colors hover:bg-[#3c4758]">Minimalism</button>
          </div>
        </header>

        <div className="columns-1 gap-16 md:columns-2 xl:columns-3">
          {artworks.map((artwork, index) => {
            const aspect =
              index % 5 === 0 ? "aspect-[3/4]" : index % 5 === 1 ? "aspect-square" : index % 5 === 2 ? "aspect-[4/5]" : index % 5 === 3 ? "aspect-[3/2]" : "aspect-[9/16]";

            return (
              <Link key={artwork.id} href={`/${manifest.id}/artwork/${artwork.slug}`} className="group relative mb-16 block break-inside-avoid">
                <div className="absolute inset-0 -z-10 bg-[#8c6a4f]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative overflow-hidden bg-[#191b22]">
                  <div className={`relative w-full ${aspect}`}>
                    <Image
                      src={artwork.imagePreview}
                      alt={artwork.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#11131a] via-transparent to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#e8be9f]">Series 0{(index % 6) + 1}</p>
                    <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl font-black uppercase tracking-[-0.05em] text-[#e1e2eb]">
                      {artwork.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href={`/${manifest.id}/contacts`} className="group flex items-center gap-4 py-8 text-sm font-bold uppercase tracking-[0.2em] text-[#e8be9f] transition-all hover:tracking-[0.3em]">
            Explore More Works
            <span className="transition-transform group-hover:translate-x-2">--&gt;</span>
          </Link>
        </div>
      </section>
    </CopperGlowLayout>
  );
}

export function CopperGlowDetail({ manifest, content, artwork, artworks }: CopperGlowDetailProps) {
  const thumbnails = artworks.filter((item) => item.id !== artwork.id).slice(0, 3);

  return (
    <CopperGlowLayout manifest={manifest} content={content} currentRoute="detail" slug={artwork.slug}>
      <main className="mx-auto min-h-screen max-w-[96rem] overflow-x-hidden px-6 pb-20 pt-6 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          <div className="relative w-full lg:w-2/3">
            <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(circle_at_center,_rgba(140,106,79,0.15),_transparent_70%)]" />
            <div className="relative z-10 w-full bg-[#191b22] shadow-2xl">
              <Image
                src={artwork.imageOriginal}
                alt={artwork.title}
                width={1600}
                height={1800}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="h-[38rem] w-full object-cover grayscale-[0.2] transition-all duration-700 hover:grayscale-0 md:h-[51rem]"
              />
              <div className="p-6 lg:hidden">
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#e8be9f]">Series 01 // Catalyst</p>
                <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-black uppercase tracking-[-0.05em]">{artwork.title}</h1>
              </div>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-4 gap-4">
              {thumbnails.map((item) => (
                <Link key={item.id} href={`/${manifest.id}/artwork/${item.slug}`} className="group aspect-square overflow-hidden border border-[#4f453d]/20 bg-[#282a31]">
                  <Image src={item.imagePreview} alt={item.title} width={400} height={400} className="h-full w-full object-cover opacity-50 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
              <div className="flex aspect-square items-center justify-center bg-[#282a31] text-[#e8be9f]">PLAY</div>
            </div>
          </div>

          <aside className="w-full space-y-12 pb-24 lg:sticky lg:top-32 lg:w-1/3 lg:h-fit lg:pb-0">
            <header className="hidden space-y-4 lg:block">
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-[#e8be9f]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#e8be9f]">Limited Edition 1/5</span>
              </div>
              <h1 className="font-[family-name:var(--font-geist-sans)] text-6xl font-black uppercase leading-none tracking-[-0.06em]">
                {artwork.title.split(" ")[0]}
                <br />
                <span className="text-[#8c6a4f]">{artwork.title.split(" ").slice(1).join(" ") || "Glow"}</span>
              </h1>
            </header>

            <div className="grid grid-cols-2 gap-px border border-[#4f453d]/10 bg-[#4f453d]/10">
              <div className="bg-[#11131a] p-6">
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#aab6c9]">Medium</p>
                <p className="font-medium text-[#e1e2eb]">{artwork.medium}</p>
              </div>
              <div className="bg-[#11131a] p-6">
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#aab6c9]">Dimensions</p>
                <p className="font-medium text-[#e1e2eb]">{artwork.size}</p>
              </div>
              <div className="bg-[#11131a] p-6">
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#aab6c9]">Created</p>
                <p className="font-medium text-[#e1e2eb]">{artwork.year}</p>
              </div>
              <div className="bg-[#11131a] p-6">
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#aab6c9]">Status</p>
                <p className="font-medium text-[#e1e2eb]">{statusLabel(artwork.status)}</p>
              </div>
            </div>

            <article className="space-y-6">
              <p className="text-lg font-light italic leading-relaxed text-[#d3c4b9]">
                &ldquo;An exploration of thermal radiation captured in stasis. The Copper Glow variant represents the catalyst
                series, where heat meets the abyss.&rdquo;
              </p>
              <div className="h-px w-full bg-[#4f453d]/10" />
              <p className="text-sm leading-relaxed text-[#e1e2eb]/70">{artwork.description}</p>
            </article>

            <div className="space-y-4 pt-6">
              <Link href={`/${manifest.id}/contacts`} className="flex w-full items-center justify-center gap-3 bg-[#e8be9f] py-6 text-sm font-bold uppercase tracking-[0.2em] text-[#442b14] transition-all duration-300 hover:bg-[#8c6a4f] hover:text-[#fff5ef] active:scale-[0.98]">
                {content.detail.inquiryLabel}
                <span>--&gt;</span>
              </Link>
              <button className="w-full border border-[#4f453d]/20 py-5 text-xs uppercase tracking-[0.2em] text-[#e1e2eb] transition-all hover:bg-[#282a31]">
                Download Technical Specs
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#4f453d]/10 pt-8">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center bg-[#33353c] text-[#e8be9f]">ART</div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#aab6c9]">Artist</p>
                  <p className="font-medium text-[#e1e2eb]">ELARA VOID</p>
                </div>
              </div>
              <div className="flex gap-4 text-[#aab6c9]">
                <span>SHARE</span>
                <span>SAVE</span>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-32 grid grid-cols-1 items-center gap-12 pb-40 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-5">
            <h2 className="mb-8 font-[family-name:var(--font-geist-sans)] text-3xl font-black uppercase tracking-[-0.05em]">
              The Process of <span className="text-[#e8be9f]">Luminescence</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="text-4xl font-black italic text-[#e8be9f]/30">01</span>
                <p className="text-sm leading-relaxed text-[#d3c4b9]">
                  Structural mapping of organic brutalist forms within the digital space, ensuring weight and balance in the composition.
                </p>
              </div>
              <div className="flex gap-6">
                <span className="text-4xl font-black italic text-[#e8be9f]/30">02</span>
                <p className="text-sm leading-relaxed text-[#d3c4b9]">
                  Thermal grading applied via custom-built shaders to replicate the behavior of molten copper.
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 md:col-span-7">
            <div className="group relative overflow-hidden bg-[#282a31]">
              <Image
                src={artwork.imagePreview}
                alt={artwork.title}
                width={1400}
                height={900}
                sizes="(max-width: 768px) 100vw, 58vw"
                className="w-full object-cover grayscale opacity-40 transition-all duration-1000 group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 border-[20px] border-[#11131a]" />
            </div>
          </div>
        </section>
      </main>
    </CopperGlowLayout>
  );
}
