import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { artworkPriceLabel, statusLabel } from "@/shared/format";

const deepImmersionNoise =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

type DeepImmersionLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
};

type DeepImmersionPageProps = {
  manifest: VariantManifest;
  content: VariantContent;
};

type DeepImmersionGalleryProps = DeepImmersionPageProps & {
  artworks: Artwork[];
};

type DeepImmersionDetailProps = DeepImmersionPageProps & {
  artwork: Artwork;
};

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "about" as const, href: `${basePath}/about`, label: content.nav.about },
    { key: "contacts" as const, href: `${basePath}/contacts`, label: content.nav.contacts },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function buildGalleryCards(manifest: VariantManifest, artworks: Artwork[]) {
  return templateMedia.deepImmersion.gallery.map((item, index) => {
    const artwork = artworks[index] ?? artworks[index % Math.max(artworks.length, 1)];

    return {
      ...item,
      image: artwork?.imagePreview ?? item.image,
      title: artwork?.title ?? item.title,
      year: artwork?.year ?? item.year,
      href: artwork ? `/${manifest.id}/artwork/${artwork.slug}` : `/${manifest.id}/gallery`,
    };
  });
}

const adminLoginHref = getAdminLoginHref();

function DeepImmersionLayout({ manifest, content, currentRoute, children }: DeepImmersionLayoutProps) {
  const navItems = buildNavItems(manifest, content);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#07090F] text-[#F1F4F9] selection:bg-[#1378ec]/30"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: deepImmersionNoise }} />
      <header className="relative z-20">
        <div className="mx-auto flex h-20 max-w-[1920px] items-center justify-between px-6 md:px-10 lg:px-[120px]">
          <Link href={`/${manifest.id}`} className="flex items-center gap-4">
            <div className="size-6 text-[#F1F4F9]">
              <svg className="h-full w-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd" />
              </svg>
            </div>
            <span className="hidden text-sm font-bold uppercase tracking-[0.26em] text-[#F1F4F9] md:block">Глубокое погружение</span>
          </Link>
          <nav className="flex items-center gap-5 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium uppercase tracking-[0.08em] transition-colors duration-300 ${
                  currentRoute === item.key ? "text-[#F1F4F9]" : "text-[#5A657A] hover:text-[#F1F4F9]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={adminLoginHref}
              className="grid size-10 place-items-center rounded-full border border-[#12151E] text-[#5A657A] transition-colors hover:border-[#1378ec] hover:text-[#F1F4F9]"
              aria-label="Войти в админку"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export function DeepImmersionHome({ manifest, content }: DeepImmersionPageProps) {
  return (
    <DeepImmersionLayout manifest={manifest} content={content} currentRoute="home">
      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1920px] flex-col lg:flex-row">
        <div className="flex w-full flex-col justify-center px-6 pb-16 pt-8 lg:w-[40%] lg:pl-[120px] lg:pr-16 lg:pt-0">
          <h1 className="mb-12 text-5xl font-bold leading-[1.04] tracking-[-0.04em] text-[#F1F4F9] md:text-6xl lg:text-[72px]">
            Форма.
            <br />
            Цвет.
            <br />
            Пустота.
          </h1>
          <Link href={`/${manifest.id}/gallery`} className="group inline-flex w-max flex-col">
            <div className="mb-2 flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-[#1378ec]">{content.home.primaryCta}</span>
              <span className="material-symbols-outlined text-xl text-[#1378ec] transition-transform duration-300 group-hover:translate-x-2">
                arrow_right_alt
              </span>
            </div>
            <div className="h-[2px] w-12 bg-[#1378ec]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#1378ec]" />
          </Link>
        </div>
        <div className="relative flex w-full items-center justify-end lg:w-[60%]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(19,120,236,0.3)_0%,_rgba(7,9,15,0)_70%)] blur-[120px]" />
          <div className="relative mr-0 w-[84%] max-w-[600px] overflow-hidden shadow-2xl lg:mr-[-5%]">
            <div className="relative h-[32rem] w-full md:h-[40rem] lg:h-[800px]">
              <Image
                src={templateMedia.deepImmersion.hero}
                alt="Abstract dark blue and textured painting"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </DeepImmersionLayout>
  );
}

export function DeepImmersionGallery({ manifest, content, artworks }: DeepImmersionGalleryProps) {
  const cards = buildGalleryCards(manifest, artworks);

  return (
    <DeepImmersionLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="px-6 pb-8 pt-8 md:px-12 lg:px-24">
        <nav className="flex items-center gap-6 text-[13px] font-medium uppercase tracking-[0.08em] md:gap-8">
          <span className="relative text-[#F1F4F9] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[#1378ec]">Все</span>
          <span className="text-[#5A657A]">2023</span>
          <span className="text-[#5A657A]">Монохром</span>
          <span className="text-[#5A657A]">Холст/масло</span>
        </nav>
      </section>
      <section className="px-6 pb-24 md:px-12 lg:px-24">
        <div className="mx-auto columns-1 gap-8 md:columns-2 lg:max-w-[1600px] lg:columns-3 lg:gap-16">
          {cards.map((card) => (
            <Link key={`${card.title}-${card.year}`} href={card.href} className="group relative mb-16 block break-inside-avoid">
              <div className="absolute inset-[-20px] -z-10 rounded-[inherit] bg-[radial-gradient(circle_at_center,_rgba(19,120,236,0.15)_0%,_transparent_70%)] opacity-0 blur-[40px] transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative overflow-hidden bg-[#12151E]">
                <div className={`relative w-full ${card.aspect}`}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-90 transition duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03] group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col justify-end bg-gradient-to-t from-[#07090F]/90 to-transparent p-6 opacity-0 transition-opacity duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100">
                  <div className="translate-y-[10px] opacity-0 transition-all delay-100 duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    <h2 className="mb-1 text-2xl font-bold tracking-[-0.04em] text-white">{card.title}</h2>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-gray-400">{card.year}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DeepImmersionLayout>
  );
}

export function DeepImmersionDetail({ manifest, content, artwork }: DeepImmersionDetailProps) {
  const detailShots = artwork.photos.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#07090F] text-[#F1F4F9]" style={{ fontFamily: "Satoshi, sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: deepImmersionNoise }} />
      <header className="fixed left-0 top-0 z-40 w-full px-6 py-6 md:px-8">
        <Link href={`/${manifest.id}/gallery`} className="group inline-flex items-center gap-2 text-[#5A657A] transition-colors hover:text-[#F1F4F9]">
          <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="text-[13px] font-medium uppercase tracking-[0.08em]">Назад в галерею</span>
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-col gap-12 px-6 pb-16 pt-[120px] md:px-8 lg:flex-row lg:gap-24 lg:px-16">
        <section className="flex w-full items-start justify-center lg:w-[65%]">
          <div className="group relative w-full max-w-[900px]">
            <div className="pointer-events-none absolute inset-[10%] -z-10 bg-[radial-gradient(circle,_rgba(140,106,79,0.15)_0%,_rgba(7,9,15,0)_70%)] blur-[120px]" />
            <div className="relative h-[40rem] w-full overflow-hidden border border-[#12151E] shadow-2xl md:h-[51rem]">
              <Image
                src={artwork.imageOriginal}
                alt={artwork.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/10">
                <span className="material-symbols-outlined text-4xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">search</span>
              </div>
            </div>
          </div>
        </section>
        <aside className="relative w-full lg:w-[35%]">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[120px]">
            <div>
              <h1 className="mb-2 text-5xl leading-tight tracking-[-0.04em] text-[#F1F4F9] lg:text-6xl" style={{ fontFamily: "Cabinet Grotesk, sans-serif" }}>
                {artwork.title}
              </h1>
              <p className="text-lg text-[#5A657A]">{artwork.year}</p>
              {artwork.series ? <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#1378ec]">{artwork.series}</p> : null}
            </div>
            <div className="border-y border-[#12151E] py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium uppercase tracking-[0.05em] text-[#5A657A]">Материал</span>
                  <span>{artwork.medium}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium uppercase tracking-[0.05em] text-[#5A657A]">Размер</span>
                  <span>{artwork.size}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium uppercase tracking-[0.05em] text-[#5A657A]">Статус</span>
                  <span>{statusLabel(artwork.status)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium uppercase tracking-[0.05em] text-[#5A657A]">Цена</span>
                  <span>{artworkPriceLabel(artwork)}</span>
                </div>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-[#F1F4F9]">{artwork.description}</p>
            {detailShots.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {detailShots.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden border border-[#12151E]">
                    <Image src={photo.urlPreview} alt={artwork.title} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <div className="pt-8">
              <Link
                href={`/${manifest.id}/contacts`}
                className="group flex h-12 w-full items-center justify-center gap-3 border border-[#5A657A] bg-[#12151E] text-sm font-bold uppercase tracking-[0.1em] text-[#F1F4F9] transition-all duration-300 hover:border-[#1378ec] hover:bg-[#1378ec] hover:text-[#07090F]"
                style={{ fontFamily: "Cabinet Grotesk, sans-serif" }}
              >
                <span>{content.detail.inquiryLabel}</span>
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export function DeepImmersionAbout({ manifest, content }: DeepImmersionPageProps) {
  return (
    <DeepImmersionLayout manifest={manifest} content={content} currentRoute="about">
      <section className="flex flex-col items-center px-4 py-16 md:px-8">
        <article className="flex w-full max-w-[800px] flex-col gap-16">
          <section className="flex flex-col items-start gap-12 md:flex-row">
            <div className="group relative w-full shrink-0 md:w-[400px]">
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[#8C6A4F]/20 blur-[80px] transition-colors duration-700 group-hover:bg-[#8C6A4F]/30" />
              <div className="relative h-[500px] w-full overflow-hidden">
                <Image
                  src={templateMedia.deepImmersion.aboutPortrait}
                  alt="Moody black and white portrait of the artist"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover grayscale contrast-125"
                />
              </div>
            </div>
            <div className="pt-4 md:pt-8">
              <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-[#1378ec]">{content.about.eyebrow}</p>
              <h1 className="mb-6 text-4xl font-bold tracking-[-0.04em] text-[#F1F4F9]">Форма. Цвет. Пустота.</h1>
              <p className="text-2xl leading-[1.8] text-[#F1F4F9]/90">{content.about.paragraphs[0]}</p>
            </div>
          </section>
          <section className="space-y-8">
            {content.about.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-2xl leading-[1.8] text-[#F1F4F9]/80">
                {paragraph}
              </p>
            ))}
          </section>
          <section className="w-full">
            <div className="relative h-[600px] w-full overflow-hidden">
              <Image
                src={templateMedia.deepImmersion.aboutStudio}
                alt="Artist studio showing brushes and dark canvases"
                fill
                sizes="100vw"
                className="object-cover grayscale contrast-125 opacity-80"
              />
              <div className="absolute bottom-4 right-4 bg-[#07090F]/80 px-4 py-2 backdrop-blur-sm">
                <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-[#5A657A]">Студия, 2023</span>
              </div>
            </div>
          </section>
          <section className="pb-20">
            <h3 className="mb-12 border-b border-[#12151E] pb-4 text-2xl text-[#F1F4F9]">Избранные выставки</h3>
            <div className="flex flex-col">
              {[
                ["2023", "Эхо Безмолвия", "Галерея Современного Искусства, Москва"],
                ["2021", "Структура Тьмы", "Art Basel, Базель"],
                ["2019", "Форма и Пустота", "Guggenheim Museum, Нью-Йорк (Групповая)"],
                ["2017", "Первое Погружение", "Независимое пространство, Санкт-Петербург"],
              ].map(([year, title, place]) => (
                <div key={title} className="group flex items-baseline gap-6 border-b border-[#12151E] py-6 transition-colors hover:bg-[#12151E]/30">
                  <div className="w-24 shrink-0 text-[#5A657A]">{year}</div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-[#F1F4F9] transition-colors group-hover:text-[#1378ec]">{title}</h4>
                    <p className="mt-1 text-sm text-[#5A657A]">{place}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </section>
    </DeepImmersionLayout>
  );
}

export function DeepImmersionContacts({ manifest, content }: DeepImmersionPageProps) {
  return (
    <div className="min-h-screen bg-[#07090F] text-[#F1F4F9]" style={{ fontFamily: "Satoshi, sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: deepImmersionNoise }} />
      <header className="absolute left-0 top-0 z-20 w-full p-8">
        <Link href={`/${manifest.id}`} className="group inline-flex items-center gap-2 text-[#5A657A] transition-colors duration-300 hover:text-[#F1F4F9]">
          <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
          <span className="text-[13px] font-medium uppercase tracking-[0.05em]">Назад</span>
        </Link>
      </header>
      <main className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(140,106,79,0.08)_0%,_rgba(7,9,15,0)_70%)] blur-[120px]" />
        <div className="w-full max-w-[480px]">
          <div className="mb-16">
            <h1 className="mb-2 text-[48px] font-bold tracking-[-0.02em] text-[#F1F4F9]" style={{ fontFamily: "Cabinet Grotesk, sans-serif" }}>
              {content.contacts.title}
            </h1>
            <p className="text-base leading-relaxed text-[#5A657A]">{content.contacts.description}</p>
          </div>
          <form className="space-y-2">
            {["Имя", "Email", "Тема"].map((label) => (
              <label key={label} className="relative mb-8 block">
                <input
                  type="text"
                  placeholder=" "
                  className="peer w-full border-0 border-b border-[#5A657A] bg-transparent px-0 py-3 text-[#F1F4F9] focus:border-[#1378ec] focus:shadow-none"
                />
                <span className="pointer-events-none absolute left-0 top-3 text-base text-[#5A657A] transition-all peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[13px] peer-focus:uppercase peer-focus:tracking-[0.05em] peer-focus:text-[#F1F4F9]">
                  {label}
                </span>
              </label>
            ))}
            <label className="relative mb-8 block">
              <textarea
                rows={4}
                placeholder=" "
                className="peer w-full resize-none border-0 border-b border-[#5A657A] bg-transparent px-0 py-3 text-[#F1F4F9] focus:border-[#1378ec] focus:shadow-none"
              />
              <span className="pointer-events-none absolute left-0 top-3 text-base text-[#5A657A] transition-all peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-[13px] peer-focus:uppercase peer-focus:tracking-[0.05em] peer-focus:text-[#F1F4F9]">
                Сообщение
              </span>
            </label>
            <div className="pt-8">
              <button
                type="button"
                className="group flex h-12 w-full items-center justify-center gap-3 border border-[#5A657A]/30 bg-[#12151E] text-[14px] font-bold uppercase tracking-[0.1em] text-[#F1F4F9] transition-all duration-400 hover:border-[#1378ec] hover:bg-[#1378ec] hover:text-white"
                style={{ fontFamily: "Cabinet Grotesk, sans-serif" }}
              >
                <span>{content.contacts.inquiryLabel}</span>
                <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
