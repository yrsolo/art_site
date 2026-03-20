import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { VariantSwitcher } from "@/components/public/variant-switcher";
import type { Artwork } from "@/features/artworks/types";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { artworkMeta, statusLabel } from "@/shared/format";

type ColdMistLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
  slug?: string;
};

type ColdMistPageProps = {
  manifest: VariantManifest;
  content: VariantContent;
};

type ColdMistGalleryProps = ColdMistPageProps & {
  artworks: Artwork[];
};

type ColdMistDetailProps = ColdMistPageProps & {
  artwork: Artwork;
};

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "about" as const, href: `${basePath}/about`, label: content.nav.about },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function splitColumns(artworks: Artwork[]) {
  return artworks.reduce<Artwork[][]>(
    (columns, artwork, index) => {
      columns[index % 3].push(artwork);
      return columns;
    },
    [[], [], []],
  );
}

function ColdMistLayout({ manifest, content, currentRoute, children, slug }: ColdMistLayoutProps) {
  const navItems = buildNavItems(manifest, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0e14] text-[#d9e6fd] selection:bg-[#bfc7cf] selection:text-[#394148]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(191,199,207,0.06),_transparent_62%)]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#06080d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-24 max-w-[90rem] items-center justify-between px-6 md:px-12">
          <div className="space-y-2">
            <Link href={`/${manifest.id}`} className="block text-2xl font-black uppercase tracking-[-0.08em] text-slate-100">
              COLD MIST
            </Link>
            <p className="hidden text-[10px] uppercase tracking-[0.32em] text-[#7f8b9e] lg:block">Atmospheric digital portfolio</p>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1 text-sm font-medium uppercase tracking-[-0.05em] transition-colors duration-300 ${
                  currentRoute === item.key
                    ? "border-slate-300 text-slate-100"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden xl:block">
              <VariantSwitcher currentVariantId={manifest.id} currentRoute={currentRoute} slug={slug} />
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="grid h-10 w-10 place-items-center text-xs uppercase tracking-[0.24em] text-slate-200 transition-colors hover:bg-slate-800/50">
                Set
              </span>
              <span className="grid h-10 w-10 place-items-center text-xs uppercase tracking-[0.24em] text-slate-200 transition-colors hover:bg-slate-800/50">
                Id
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 px-6 py-3 md:hidden">
          <VariantSwitcher currentVariantId={manifest.id} currentRoute={currentRoute} slug={slug} />
        </div>
      </header>

      <main className="relative z-10 pt-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around border-t border-white/5 bg-[#06080d]/90 backdrop-blur-2xl md:hidden">
        <Link
          href={`/${manifest.id}`}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-3 text-[10px] uppercase tracking-[0.18em] ${
            currentRoute === "home" ? "bg-slate-800 text-slate-100" : "text-slate-500"
          }`}
        >
          <span>Discover</span>
        </Link>
        <Link
          href={`/${manifest.id}/gallery`}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-3 text-[10px] uppercase tracking-[0.18em] ${
            currentRoute === "gallery" || currentRoute === "detail" ? "bg-slate-800 text-slate-100" : "text-slate-500"
          }`}
        >
          <span>Archive</span>
        </Link>
        <Link
          href={`/${manifest.id}/contacts`}
          className={`flex flex-col items-center justify-center gap-1 px-4 py-3 text-[10px] uppercase tracking-[0.18em] ${
            currentRoute === "contacts" ? "bg-slate-800 text-slate-100" : "text-slate-500"
          }`}
        >
          <span>Curate</span>
        </Link>
      </nav>
    </div>
  );
}

export function ColdMistHome({ manifest, content, artworks }: ColdMistGalleryProps) {
  const featured = artworks[0];
  const secondary = artworks[1] ?? artworks[0];

  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="home">
      <section className="mx-auto flex max-w-7xl flex-col items-start px-6 pb-24 pt-16 md:px-12 md:pt-28">
        <div className="mb-24 flex w-full flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <h1 className="max-w-3xl text-6xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-slate-100 md:text-8xl xl:text-9xl">
            Форма.
            <br />
            Цвет.
            <br />
            Пустота.
          </h1>
          <div className="max-w-xs border-l border-[#3c495b] pl-4">
            <p className="text-xs font-medium uppercase leading-relaxed tracking-[0.12em] text-[#9facc1]">{content.home.description}</p>
          </div>
        </div>

        {featured ? (
          <Link href={`/${manifest.id}/artwork/${featured.slug}`} className="group relative block w-full">
            <div className="absolute inset-0 -z-10 bg-[#bfc7cf]/5 blur-3xl transition-all duration-700 group-hover:bg-[#bfc7cf]/10" />
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#121a25]">
              <Image
                src={featured.imageOriginal}
                alt={featured.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-70 grayscale transition-transform duration-[1800ms] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 space-y-2 md:bottom-12 md:left-12">
                <span className="text-sm font-bold uppercase tracking-[0.32em] text-[#d9e6fd]">{featured.title}</span>
                <div className="h-px w-24 bg-[#bfc7cf]" />
              </div>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          <div className="flex min-h-[400px] flex-col justify-between bg-[#0e141c] p-12 transition-colors duration-500 hover:bg-[#121a25] md:col-span-2">
            <div className="flex items-start justify-between">
              <span className="text-4xl text-[#b2bac1]">+</span>
              <span className="text-xs uppercase tracking-[0.3em] text-[#6a768a]">Core functionality</span>
            </div>
            <div>
              <h2 className="mb-6 text-4xl font-black uppercase tracking-[-0.06em] text-slate-100">Curated Diffusion</h2>
              <p className="mb-8 max-w-md text-base leading-7 text-[#9facc1]">
                Архив выстроен как тихая последовательность атмосферных состояний, где интерфейс только удерживает фокус и не спорит с работой.
              </p>
              <Link
                href={`/${manifest.id}/gallery`}
                className="inline-flex bg-[#bfc7cf] px-8 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#394148] transition-transform duration-300 active:scale-95"
              >
                {content.home.primaryCta}
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
            <span className="text-3xl text-[#989ea7]">[]</span>
            <h3 className="text-xl font-bold uppercase tracking-[-0.04em] text-slate-100">Archive State</h3>
            <p className="text-sm leading-6 text-[#9facc1]">Temporal snapshots of evolving silence, held in cold slate and mist light.</p>
          </div>

          <div className="flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
            <span className="text-3xl text-[#989ea7]">#</span>
            <h3 className="text-xl font-bold uppercase tracking-[-0.04em] text-slate-100">Grid Logic</h3>
            <p className="text-sm leading-6 text-[#9facc1]">Architectural cadence for artworks that need distance, breath, and restraint.</p>
          </div>

          <div className="relative h-[320px] overflow-hidden md:col-span-2">
            {secondary ? (
              <Image
                src={secondary.imageOriginal}
                alt={secondary.title}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover opacity-35 grayscale"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14] via-[#0a0e14]/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-12">
              <span className="text-4xl font-black uppercase tracking-[-0.06em] text-[#bfc7cf] md:text-5xl">Void Analytics</span>
              <p className="mt-4 max-w-md text-sm uppercase tracking-[0.18em] text-[#9facc1]">{manifest.northStar}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between bg-[#121a25] p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#6a768a]">Selection</p>
              <p className="mt-4 text-sm leading-7 text-[#9facc1]">
                {artworks.length} visible works arranged without decorative containment and tuned for collector comparison.
              </p>
            </div>
            <Link href={`/${manifest.id}/about`} className="mt-8 inline-flex text-sm uppercase tracking-[0.18em] text-slate-100 transition-colors hover:text-[#bfc7cf]">
              {content.home.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-40 flex max-w-7xl flex-col gap-12 px-6 pb-28 md:flex-row md:items-end md:justify-between md:px-12">
        <div className="max-w-md">
          <h4 className="mb-4 text-2xl font-bold uppercase tracking-[-0.05em] text-slate-100">Stay within the mist.</h4>
          <div className="relative w-full border-b border-[#3c495b]">
            <div className="py-4 text-sm uppercase tracking-[0.22em] text-[#6a768a]">ENTER YOUR IDENTITY</div>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#bfc7cf]">-&gt;</span>
          </div>
        </div>
        <div className="flex flex-col items-start text-left md:items-end md:text-right">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#6a768a]">Version 4.0.2</div>
          <div className="max-w-[220px] text-[10px] uppercase tracking-[0.24em] text-[#9facc1]">
            Designed for the silent observer. All rights reserved by Cold Mist Studio.
          </div>
        </div>
      </section>
    </ColdMistLayout>
  );
}

export function ColdMistGallery({ manifest, content, artworks }: ColdMistGalleryProps) {
  const columns = splitColumns(artworks);

  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-10 md:px-12 md:pt-20">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#6a768a]">{content.gallery.eyebrow}</p>
            <h1 className="mb-4 text-5xl font-bold tracking-[-0.06em] text-[#d9e6fd] md:text-7xl">ARCHIVE.</h1>
            <p className="text-lg font-light leading-relaxed text-[#9facc1]">{content.gallery.description}</p>
          </div>
          <div className="flex items-center gap-8 border-b border-[#3c495b]/30 pb-2 text-sm font-medium uppercase tracking-[-0.04em]">
            <span className="text-[#bfc7cf]">All</span>
            <span className="text-[#9facc1]">2025</span>
            <span className="text-[#9facc1]">2024</span>
            <span className="text-[#9facc1]">Experimental</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3">
          {columns.map((column, index) => (
            <div key={`column-${index}`} className={`flex flex-col gap-12 ${index === 1 ? "md:mt-24" : ""}`}>
              {column.map((artwork) => (
                <Link key={artwork.id} href={`/${manifest.id}/artwork/${artwork.slug}`} className="group relative block">
                  <div className="absolute inset-0 -z-10 scale-150 bg-[radial-gradient(circle,_rgba(191,199,207,0.08),_transparent_70%)] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="overflow-hidden bg-[#121a25]">
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={artwork.imagePreview}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-[-0.04em] text-[#d9e6fd]">{artwork.title}</h3>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-[#9facc1]">{artworkMeta(artwork)}</p>
                    </div>
                    <span className="text-sm text-[#6a768a]">NE</span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-white/5 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6a768a]">Collector mode</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.06em] text-slate-100">Curate Your View.</h2>
          </div>
          <Link href={`/${manifest.id}/contacts`} className="inline-flex bg-[#121a25] px-6 py-4 text-xs uppercase tracking-[0.24em] text-slate-100 transition-colors hover:bg-[#16202e]">
            {content.detail.inquiryLabel}
          </Link>
        </div>
      </section>
    </ColdMistLayout>
  );
}

export function ColdMistDetail({ manifest, content, artwork }: ColdMistDetailProps) {
  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="detail" slug={artwork.slug}>
      <div className="flex min-h-screen flex-col pb-20 md:flex-row md:pb-0">
        <section className="w-full overflow-hidden bg-[#0a0e14] p-6 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:w-3/5 md:p-10 lg:w-2/3 lg:p-16">
          <div className="relative h-[62vh] w-full overflow-hidden bg-[#121a25] shadow-[0_0_100px_rgba(0,0,0,0.8)] md:h-full">
            <Image src={artwork.imageOriginal} alt={artwork.title} fill priority sizes="(max-width: 768px) 100vw, 66vw" className="object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/45 to-transparent" />
            <div className="absolute bottom-8 left-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9facc1]/70">
              <span>Zoom</span>
              <span>Expand View</span>
            </div>
          </div>
        </section>

        <section className="z-10 min-h-screen w-full bg-[#0e141c] px-8 py-16 md:w-2/5 md:px-12 md:py-24 lg:w-1/3 lg:px-16 lg:py-32">
          <div className="flex min-h-full flex-col justify-between">
            <div>
              <div className="mb-12">
                <span className="mb-4 block text-[10px] uppercase tracking-[0.4em] text-[#9facc1]">Volume IV / Series 02</span>
                <h1 className="mb-6 text-5xl font-bold uppercase leading-none tracking-[-0.06em] text-[#d9e6fd] md:text-6xl lg:text-7xl">
                  {artwork.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-[#bfc7cf]" />
                  <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#bfc7cf]">{statusLabel(artwork.status)}</p>
                </div>
              </div>

              <div className="mb-16 space-y-8">
                <p className="text-lg font-light leading-relaxed text-[#d9e6fd]">{artwork.description}</p>
                <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#9facc1]">Dimensions</p>
                    <p className="text-sm font-medium">{artwork.size}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#9facc1]">Medium</p>
                    <p className="text-sm font-medium">{artwork.medium}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#9facc1]">Year</p>
                    <p className="text-sm font-medium">{artwork.year}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#9facc1]">Edition</p>
                    <p className="text-sm font-medium">Original abstract</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link href={`/${manifest.id}/contacts`} className="inline-flex justify-center bg-[#bfc7cf] px-8 py-6 text-sm font-bold uppercase tracking-[0.2em] text-[#394148] transition-colors hover:bg-[#cdd5dd]">
                  {content.detail.inquiryLabel}
                </Link>
                <button className="bg-[#16202e] px-8 py-6 text-sm font-medium uppercase tracking-[0.2em] text-[#d9e6fd] transition-colors hover:bg-[#1e2d41]">
                  Download Technical Specs
                </button>
              </div>
            </div>

            <div className="mt-20">
              <p className="text-[10px] uppercase leading-relaxed tracking-[0.16em] text-[#9facc1]/50">
                All artworks are authenticated with encrypted digital certificates. COLD MIST operates as a sovereign entity in the
                curation of atmospheric digital artifacts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ColdMistLayout>
  );
}
