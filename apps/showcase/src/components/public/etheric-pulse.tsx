import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { statusLabel } from "@/shared/format";

type VariantProps = {
  manifest: VariantManifest;
  content: VariantContent;
};

type GalleryProps = VariantProps & { artworks: Artwork[] };
type DetailProps = VariantProps & { artwork: Artwork };

function navItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;
  return [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "about" as const, href: `${basePath}/about`, label: content.nav.about },
    { key: "contacts" as const, href: `${basePath}/contacts`, label: content.nav.contacts },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function EthericPulseLayout({
  manifest,
  content,
  currentRoute,
  children,
}: VariantProps & { currentRoute: VariantRouteKey; children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0c0e17] text-[#e1e4fb]" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12%] top-[-8%] h-[38rem] w-[38rem] rounded-full bg-[#a894ff]/15 blur-[120px]" />
        <div className="absolute bottom-[-12%] right-[-8%] h-[34rem] w-[34rem] rounded-full bg-[#82d3dc]/10 blur-[120px]" />
      </div>
      <header className="fixed inset-x-0 top-0 z-40 bg-[#0c0e17]/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(168,148,255,0.06)]">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-8 py-6">
          <Link href={`/${manifest.id}`} className="font-[Manrope] text-2xl font-bold tracking-tight text-[#e1e4fb] hover:text-[#a894ff]">
            Aetheria
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {navItems(manifest, content).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  currentRoute === item.key
                    ? "border-b border-[#a894ff]/40 pb-1 font-[Manrope] text-[#a894ff]"
                    : "font-[Manrope] text-[#e1e4fb]/70 transition-colors hover:text-[#a894ff]"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button className="rounded-full p-2 text-[#e1e4fb] hover:bg-white/5" type="button">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>
      <main className="relative z-10 pt-24">{children}</main>
    </div>
  );
}

export function EthericPulseHome({ manifest, content }: VariantProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="home">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <Image src={templateMedia.ethericPulse.hero} alt={content.home.title} fill priority className="object-cover opacity-40 mix-blend-lighten" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#82d3dc]/90">{content.home.eyebrow}</p>
          <h1 className="mb-8 font-[Manrope] text-6xl font-extrabold leading-[0.94] tracking-[-0.05em] md:text-8xl lg:text-9xl">
            A breathing digital gallery where light and interface dissolve into{" "}
            <span className="bg-gradient-to-r from-[#a894ff] via-[#c6b7ff] to-[#82d3dc] bg-clip-text text-transparent">energy</span>.
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#b9c0d7]">{content.home.description}</p>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <Link href={`/${manifest.id}/gallery`} className="rounded-full bg-[#a894ff] px-10 py-5 font-medium text-[#190055] shadow-[0_0_40px_rgba(168,148,255,0.35)] transition hover:scale-105">
              {content.home.primaryCta}
            </Link>
            <Link href={`/${manifest.id}/about`} className="flex items-center gap-2 text-[#e1e4fb] transition hover:text-[#82d3dc]">
              <span>{content.home.secondaryCta}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-8 px-8 py-24 md:grid-cols-12">
        <div className="group relative overflow-hidden rounded-[1.75rem] bg-[#10131d] p-1 md:col-span-7">
          <div className="relative h-[600px] overflow-hidden rounded-[1.5rem]">
            <Image src={templateMedia.ethericPulse.feature} alt="Energy feature artwork" fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#ffd6d6]">Collection 2024</p>
              <h2 className="font-[Manrope] text-3xl font-bold">Vibrations of the Void</h2>
              <p className="mt-4 max-w-md text-[#a7aac0]">A softer dark structure where the interface recedes and the pulse of the image becomes the main light source.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:col-span-5">
          <article className="flex flex-1 flex-col justify-end rounded-[1.75rem] bg-[#1b1f2e] p-8">
            <span className="material-symbols-outlined mb-6 text-4xl text-[#82d3dc]/70">auto_awesome</span>
            <h3 className="mb-2 font-[Manrope] text-2xl font-semibold">Meditative Contemplation</h3>
            <p className="text-[#a7aac0]">Glass panels, rounded pulses, and a viewing rhythm tuned to breath instead of grid severity.</p>
          </article>
          <div className="relative h-[300px] overflow-hidden rounded-[1.75rem] bg-[#10131d]">
            <Image src={templateMedia.ethericPulse.secondary} alt="Secondary energy artwork" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover grayscale transition duration-1000 hover:grayscale-0" />
          </div>
        </div>
      </section>
    </EthericPulseLayout>
  );
}

export function EthericPulseGallery({ manifest, content, artworks }: GalleryProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="mx-auto max-w-screen-2xl px-6 pb-24 pt-8 md:px-12 lg:px-24">
        <div className="mb-16 space-y-6">
          <h1 className="font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] md:text-7xl">Gallery of Flows</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#a7aac0]">{content.gallery.description}</p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <span className="rounded-full bg-[#a894ff] px-6 py-2 text-sm text-[#190055]">Все потоки</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Вибрации</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Тишина</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Трансцендентность</span>
          </div>
        </div>
        <div className="columns-1 gap-8 md:columns-2 xl:columns-3">
          {templateMedia.ethericPulse.gallery.map((image, index) => {
            const artwork = artworks[index] ?? artworks[index % artworks.length];
            return (
              <Link key={`${artwork.slug}-${index}`} href={`/${manifest.id}/artwork/${artwork.slug}`} className="group relative mb-8 block break-inside-avoid overflow-hidden rounded-[1.75rem] bg-[#10131d]">
                <Image src={image} alt={artwork.title} width={900} height={1200} className="h-auto w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent p-8 opacity-0 transition duration-500 group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#82d3dc]">{artwork.year}</p>
                  <h3 className="mt-2 font-[Manrope] text-2xl font-bold">{artwork.title}</h3>
                  <p className="mt-1 text-sm text-[#ffd6d6]/80">{artwork.medium}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </EthericPulseLayout>
  );
}

export function EthericPulseAbout({ manifest, content }: VariantProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="about">
      <main className="relative mx-auto max-w-screen-2xl overflow-hidden px-6 pb-24 pt-8 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#a894ff]/10 blur-2xl transition duration-700 group-hover:bg-[#a894ff]/20" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#161926]">
              <Image src={templateMedia.ethericPulse.portrait} alt="Etheric Pulse portrait" width={1200} height={1500} className="aspect-[4/5] w-full object-cover opacity-90 transition duration-1000 group-hover:scale-105" />
            </div>
          </div>
          <div className="space-y-8 pt-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#82d3dc]">{content.about.eyebrow}</p>
            <h1 className="font-[Manrope] text-6xl font-bold leading-[0.92] tracking-[-0.05em]">
              Эфирный <span className="text-[#a38dff]">Проводник</span>
            </h1>
            <p className="text-2xl font-light leading-relaxed text-[#e1e4fb]">
              Её искусство не создаётся в привычном смысле — оно <span className="text-[#ffd6d6]">протекает сквозь неё</span>, превращая невидимые потоки энергии в осязаемые полотна.
            </p>
            <p className="max-w-xl text-lg leading-[1.8] text-[#a7aac0]">
              Работая в медитативном состоянии, она использует свет и цвет как инструменты для визуализации метафизических процессов.
            </p>
          </div>
        </div>
      </main>
    </EthericPulseLayout>
  );
}

export function EthericPulseDetail({ manifest, content, artwork }: DetailProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="detail">
      <main className="mx-auto flex max-w-[1920px] flex-col gap-16 px-8 pb-16 pt-[120px] lg:flex-row lg:gap-24 lg:px-16">
        <div className="flex w-full justify-center lg:w-[65%]">
          <div className="group relative w-full max-w-[900px] cursor-zoom-in">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(168,148,255,0.16),_rgba(7,9,15,0)_70%)] blur-[120px]" />
            <Image src={templateMedia.ethericPulse.detail} alt={artwork.title} width={1400} height={1800} className="h-[819px] w-full border border-[#12151e] object-cover shadow-2xl transition duration-700 group-hover:scale-[1.02]" />
          </div>
        </div>
        <aside className="w-full lg:w-[35%]">
          <div className="sticky top-[120px] flex flex-col gap-8">
            <div>
              <h1 className="font-[Manrope] text-5xl font-bold leading-tight">{artwork.title}</h1>
              <p className="mt-2 text-lg text-[#5A657A]">{artwork.year}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-y border-[#12151e] py-6">
              <div>
                <p className="text-[13px] uppercase tracking-[0.05em] text-[#5A657A]">Материал</p>
                <p>{artwork.medium}</p>
              </div>
              <div>
                <p className="text-[13px] uppercase tracking-[0.05em] text-[#5A657A]">Размер</p>
                <p>{artwork.size}</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed">{artwork.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-full bg-[#161926] px-5 py-3 text-center text-[#82d3dc]">{statusLabel(artwork.status)}</div>
              <Link href={`/${manifest.id}/contacts`} className="rounded-full bg-[#a894ff] px-5 py-3 text-center font-medium text-[#190055]">
                {content.detail.inquiryLabel}
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </EthericPulseLayout>
  );
}

export function EthericPulseContacts({ manifest, content }: VariantProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="contacts">
      <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-6 py-16">
        <div className="relative w-full max-w-[480px]">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(140,106,79,0.12),_rgba(7,9,15,0)_70%)] blur-[120px]" />
          <div className="mb-12">
            <h1 className="font-[Manrope] text-[48px] font-bold tracking-[-0.02em]">Связь</h1>
            <p className="mt-2 text-[#5A657A]">Для серьёзных запросов, приобретения работ и обсуждения выставок.</p>
          </div>
          <form className="space-y-8">
            {["Имя", "Email", "Тема"].map((label) => (
              <label key={label} className="block">
                <span className="mb-3 block text-xs uppercase tracking-[0.12em] text-[#5A657A]">{label}</span>
                <input className="w-full border-0 border-b border-[#5A657A] bg-transparent px-0 py-3 text-[#F1F4F9] focus:border-[#1378ec] focus:shadow-none" placeholder=" " />
              </label>
            ))}
            <label className="block">
              <span className="mb-3 block text-xs uppercase tracking-[0.12em] text-[#5A657A]">Сообщение</span>
              <textarea rows={4} className="w-full resize-none border-0 border-b border-[#5A657A] bg-transparent px-0 py-3 text-[#F1F4F9] focus:border-[#1378ec] focus:shadow-none" />
            </label>
            <button type="button" className="flex h-12 w-full items-center justify-center gap-3 border border-[#5A657A]/30 bg-[#12151E] font-[Cabinet Grotesk] text-[14px] uppercase tracking-[0.1em] text-[#F1F4F9] transition hover:border-[#1378ec] hover:bg-[#1378ec]">
              <span>Отправить</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        </div>
      </main>
    </EthericPulseLayout>
  );
}
