import Image from "next/image";
import Link from "next/link";

import { VariantSwitcher } from "@/components/public/variant-switcher";
import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import type { VariantContent, VariantManifest } from "@/features/variants/types";

type ColdMistLiteralHomeProps = {
  manifest: VariantManifest;
  content: VariantContent;
  artworks: Artwork[];
};

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "home", href: basePath, label: content.nav.home, active: true },
    { key: "gallery", href: `${basePath}/gallery`, label: content.nav.gallery, active: false },
    { key: "about", href: `${basePath}/about`, label: content.nav.about, active: false },
  ].filter((item) => manifest.supportedRoutes.includes(item.key as "home" | "gallery" | "about"));
}

export function ColdMistLiteralHome({ manifest, content, artworks }: ColdMistLiteralHomeProps) {
  const featured = artworks[0];
  const secondary = artworks[1] ?? artworks[0];
  const navItems = buildNavItems(manifest, content);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0a0e14] text-[#d9e6fd] selection:bg-[#bfc7cf] selection:text-[#394148]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <nav className="fixed left-0 top-0 z-50 flex h-24 w-full items-center justify-between bg-slate-950/80 px-6 backdrop-blur-xl md:px-12">
        <div className="text-2xl font-black uppercase tracking-[-0.05em] text-slate-100">COLD MIST</div>
        <div className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.active
                  ? "border-b-2 border-slate-300 pb-1 text-sm font-medium uppercase tracking-[-0.05em] text-slate-100"
                  : "text-sm font-medium uppercase tracking-[-0.05em] text-slate-500 transition-colors duration-400 hover:text-slate-300"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <VariantSwitcher currentVariantId={manifest.id} currentRoute="home" />
          <button className="p-2 text-slate-200 transition-all duration-400 hover:bg-slate-800/50 active:scale-95" type="button">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="p-2 text-slate-200 transition-all duration-400 hover:bg-slate-800/50 active:scale-95" type="button">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </nav>

      <main className="relative min-h-screen pb-32 pt-24">
        <div className="mist-gradient pointer-events-none absolute inset-0 z-0" />

        <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-start px-6 pb-24 pt-16 md:px-12 md:pt-32">
          <div className="mb-24 flex w-full flex-col items-start gap-12 md:flex-row md:items-end">
            <h1 className="tight-tracking max-w-3xl text-6xl font-black uppercase leading-[0.85] md:text-9xl">
              Форма.
              <br />
              Цвет.
              <br />
              Пустота.
            </h1>
            <div className="max-w-xs md:pb-4">
              <p className="border-l border-[#3c495b] pl-4 text-xs font-medium uppercase leading-relaxed tracking-tight text-[#9facc1]">
                {content.home.description}
              </p>
            </div>
          </div>

          {featured ? (
            <Link href={`/${manifest.id}/artwork/${featured.slug}`} className="group relative w-full">
              <div className="absolute inset-0 -z-10 bg-[#bfc7cf]/5 blur-3xl transition-all duration-700 group-hover:bg-[#bfc7cf]/10" />
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#121a25]">
                <Image
                  src={templateMedia.coldMist.hero}
                  alt={featured.title}
                  fill
                  priority
                  sizes="100vw"
                  className="h-full w-full object-cover grayscale opacity-60 transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute bottom-12 left-12 flex flex-col gap-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-[#d9e6fd]">MIST_ENTITY_01</span>
                  <div className="h-px w-24 bg-[#bfc7cf]" />
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        <section className="relative z-10 mx-auto mt-32 max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
            <div className="group flex min-h-[400px] flex-col justify-between bg-[#0e141c] p-12 transition-colors duration-500 hover:bg-[#121a25] md:col-span-2">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-4xl text-[#b2bac1]">filter_vintage</span>
                <span className="text-xs font-mono uppercase tracking-widest text-[#6a768a]">Core Functionality</span>
              </div>
              <div>
                <h2 className="tight-tracking mb-6 text-4xl font-black uppercase">Curated Diffusion</h2>
                <p className="mb-8 max-w-md text-[#9facc1]">
                  Our proprietary algorithm generates visual silence, capturing the weight of the void in every pixel.
                </p>
                <Link href={`/${manifest.id}/gallery`} className="inline-flex bg-[#bfc7cf] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#394148] transition-all active:scale-95">
                  {content.home.primaryCta}
                </Link>
              </div>
            </div>

            <div className="group flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
              <span className="material-symbols-outlined text-3xl text-[#989ea7]">auto_awesome_motion</span>
              <h3 className="tight-tracking text-xl font-bold uppercase">Archive State</h3>
              <p className="text-sm text-[#9facc1]">Temporal snapshots of evolving digital consciousness.</p>
            </div>

            <div className="group flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
              <span className="material-symbols-outlined text-3xl text-[#989ea7]">grid_view</span>
              <h3 className="tight-tracking text-xl font-bold uppercase">Grid Logic</h3>
              <p className="text-sm text-[#9facc1]">Architectural frameworks for ethereal manifestations.</p>
            </div>

            <div className="relative h-[300px] overflow-hidden md:col-span-2">
              {secondary ? (
                <Image
                  src={templateMedia.coldMist.secondary}
                  alt={secondary.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="h-full w-full object-cover grayscale opacity-30"
                />
              ) : null}
              <div className="absolute inset-0 p-12">
                <div className="flex h-full flex-col justify-center">
                  <span className="text-4xl font-black uppercase tracking-tighter text-[#bfc7cf]">Void Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-48 flex max-w-7xl flex-col justify-between gap-12 px-6 pb-24 md:flex-row md:items-end md:px-12">
          <div className="max-w-md">
            <h4 className="tight-tracking mb-4 text-2xl font-bold uppercase">Stay within the mist.</h4>
            <div className="relative w-full">
              <div className="border-b border-[#3c495b] py-4 text-sm uppercase tracking-widest text-[#9facc1]">ENTER YOUR IDENTITY</div>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#bfc7cf]">arrow_forward</span>
            </div>
          </div>
          <div className="flex flex-col items-start text-left md:items-end md:text-right">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6a768a]">Version 4.0.2</div>
            <div className="max-w-[180px] text-[10px] uppercase tracking-widest text-[#9facc1]">
              Designed for the silent observer. All rights reserved by Cold Mist Studio.
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around bg-slate-950/90 backdrop-blur-2xl md:hidden">
        <Link href={`/${manifest.id}`} className="flex flex-col items-center justify-center bg-slate-800 p-4 text-slate-100 transition-all duration-400">
          <span className="material-symbols-outlined mb-1">grid_view</span>
          <span className="text-[10px] uppercase tracking-tight">Discover</span>
        </Link>
        <Link href={`/${manifest.id}/gallery`} className="flex flex-col items-center justify-center p-4 text-slate-600 transition-colors duration-400 hover:text-slate-300">
          <span className="material-symbols-outlined mb-1">auto_awesome_motion</span>
          <span className="text-[10px] uppercase tracking-tight">Archive</span>
        </Link>
        <Link href={`/${manifest.id}/contacts`} className="flex flex-col items-center justify-center p-4 text-slate-600 transition-colors duration-400 hover:text-slate-300">
          <span className="material-symbols-outlined mb-1">filter_vintage</span>
          <span className="text-[10px] uppercase tracking-tight">Curate</span>
        </Link>
      </nav>
    </div>
  );
}
