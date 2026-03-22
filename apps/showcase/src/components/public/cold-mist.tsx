"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "@/components/public/showcase-link";

import { ColdMistGalleryClient } from "@/components/public/cold-mist-gallery-client";
import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import type { VariantContent, VariantManifest, VariantRouteKey, VariantSiteAssets } from "@/features/variants/types";
import { artworkPriceLabel, statusLabel } from "@/shared/format";

type ColdMistLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
};

type ColdMistPageProps = {
  manifest: VariantManifest;
  content: VariantContent;
  siteAssets?: VariantSiteAssets;
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

const adminLoginHref = getAdminLoginHref();

function coldMistHeroTitle() {
  return ["&#1060;&#1086;&#1088;&#1084;&#1072;.", "&#1062;&#1074;&#1077;&#1090;.", "&#1055;&#1091;&#1089;&#1090;&#1086;&#1090;&#1072;."];
}

function ColdMistLayout({ manifest, content, currentRoute, children }: ColdMistLayoutProps) {
  const navItems = buildNavItems(manifest, content);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#0a0e14] text-[#d9e6fd] selection:bg-[#bfc7cf] selection:text-[#394148]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,_rgba(191,199,207,0.05),_transparent_70%)]" />

      <header className="fixed left-0 top-0 z-50 flex h-24 w-full items-center justify-between bg-slate-950/80 px-6 backdrop-blur-xl md:px-12">
        <Link href={`/${manifest.id}`} className="text-2xl font-black uppercase tracking-[-0.05em] text-slate-100">
          COLD MIST
        </Link>
        <nav className="hidden items-center gap-12 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                currentRoute === item.key
                  ? "border-b-2 border-slate-300 pb-1 text-sm font-medium uppercase tracking-[-0.05em] text-slate-100"
                  : "text-sm font-medium uppercase tracking-[-0.05em] text-slate-500 transition-colors duration-400 hover:text-slate-300"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href={adminLoginHref}
            className="p-2 text-slate-200 transition-all duration-400 hover:bg-slate-800/50 active:scale-95"
            aria-label="Открыть админку"
          >
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <Link
            href={adminLoginHref}
            className="p-2 text-slate-200 transition-all duration-400 hover:bg-slate-800/50 active:scale-95"
            aria-label="Войти в админку"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-24">{children}</main>

      <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around bg-slate-950/90 backdrop-blur-2xl md:hidden">
        <Link href={`/${manifest.id}`} className={`flex flex-col items-center justify-center p-4 ${currentRoute === "home" ? "bg-slate-800 text-slate-100" : "text-slate-600"}`}>
          <span className="material-symbols-outlined mb-1">grid_view</span>
          <span className="text-[10px] uppercase tracking-tight">Discover</span>
        </Link>
        <Link href={`/${manifest.id}/gallery`} className={`flex flex-col items-center justify-center p-4 ${currentRoute === "gallery" || currentRoute === "detail" ? "bg-slate-800 text-slate-100" : "text-slate-600"}`}>
          <span className="material-symbols-outlined mb-1">auto_awesome_motion</span>
          <span className="text-[10px] uppercase tracking-tight">Archive</span>
        </Link>
        <Link href={`/${manifest.id}/contacts`} className={`flex flex-col items-center justify-center p-4 ${currentRoute === "contacts" ? "bg-slate-800 text-slate-100" : "text-slate-600"}`}>
          <span className="material-symbols-outlined mb-1">filter_vintage</span>
          <span className="text-[10px] uppercase tracking-tight">Curate</span>
        </Link>
      </nav>
    </div>
  );
}

export function ColdMistHome({ manifest, content, siteAssets }: ColdMistPageProps) {
  const titleLines = coldMistHeroTitle();
  const heroImage = siteAssets?.home.heroImage;

  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="home">
      <div className="mist-gradient pointer-events-none absolute inset-0 z-0" />

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-start px-6 pb-24 pt-16 md:px-12 md:pt-32">
        <div className="mb-24 flex w-full flex-col items-start gap-12 md:flex-row md:items-end">
          <h1 className="tight-tracking max-w-3xl text-6xl font-black uppercase leading-[0.97] md:text-9xl">
            <span dangerouslySetInnerHTML={{ __html: titleLines[0] }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: titleLines[1] }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: titleLines[2] }} />
          </h1>
          <div className="max-w-xs md:pb-4">
            <p className="border-l border-[#3c495b] pl-4 text-xs font-medium uppercase leading-relaxed tracking-tight text-[#9facc1]">
              {content.home.description}
            </p>
          </div>
        </div>

        <Link href={`/${manifest.id}/gallery`} className="group relative w-full">
          <div className="absolute inset-0 -z-10 bg-[#bfc7cf]/5 blur-3xl transition-all duration-700 group-hover:bg-[#bfc7cf]/10" />
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#121a25]">
            <Image
              src={heroImage?.url ?? templateMedia.coldMist.hero}
              alt={heroImage?.alt || "Abstract misty gray texture"}
              fill
              priority
              sizes="100vw"
              className="h-full w-full object-cover grayscale opacity-60 transition-transform duration-[2000ms] group-hover:scale-105"
            />
            <div className="absolute bottom-12 left-12 flex flex-col gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-[#d9e6fd]">СУЩНОСТЬ_ТУМАНА_01</span>
              <div className="h-px w-24 bg-[#bfc7cf]" />
            </div>
          </div>
        </Link>
      </section>

      <section className="relative z-10 mx-auto mt-32 max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          <div className="group flex min-h-[400px] flex-col justify-between bg-[#0e141c] p-12 transition-colors duration-500 hover:bg-[#121a25] md:col-span-2">
            <div className="flex items-start justify-between">
              <span className="material-symbols-outlined text-4xl text-[#b2bac1]">filter_vintage</span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#6a768a]">Основная функция</span>
            </div>
            <div>
              <h2 className="tight-tracking mb-6 text-4xl font-black uppercase">Кураторская диффузия</h2>
              <p className="mb-8 max-w-md text-[#9facc1]">
                Наш собственный алгоритм генерирует визуальную тишину, удерживая вес пустоты в каждом пикселе.
              </p>
              <Link href={`/${manifest.id}/gallery`} className="inline-flex bg-[#bfc7cf] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#394148] transition-all active:scale-95">
                {content.home.primaryCta}
              </Link>
            </div>
          </div>

          <div className="group flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
            <span className="material-symbols-outlined text-3xl text-[#989ea7]">auto_awesome_motion</span>
            <h3 className="tight-tracking text-xl font-bold uppercase">Состояние архива</h3>
            <p className="text-sm text-[#9facc1]">Временные снимки развивающегося цифрового сознания.</p>
          </div>

          <div className="group flex flex-col justify-end gap-6 bg-[#16202e] p-8 transition-colors duration-500 hover:bg-[#1e2d41]">
            <span className="material-symbols-outlined text-3xl text-[#989ea7]">grid_view</span>
            <h3 className="tight-tracking text-xl font-bold uppercase">Логика сетки</h3>
            <p className="text-sm text-[#9facc1]">Архитектурные каркасы для эфемерных проявлений.</p>
          </div>

          <div className="relative h-[300px] overflow-hidden md:col-span-2">
            <Image
              src={templateMedia.coldMist.secondary}
              alt="Dark smoke pattern"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="h-full w-full object-cover grayscale opacity-30"
            />
            <div className="absolute inset-0 p-12">
              <div className="flex h-full flex-col justify-center">
                <span className="text-4xl font-black uppercase tracking-tighter text-[#bfc7cf]">Аналитика пустоты</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-48 flex max-w-7xl flex-col justify-between gap-12 px-6 pb-24 md:flex-row md:items-end md:px-12">
        <div className="max-w-md">
          <h4 className="tight-tracking mb-4 text-2xl font-bold uppercase">Оставайтесь внутри тумана.</h4>
          <div className="relative w-full">
            <div className="border-b border-[#3c495b] py-4 text-sm uppercase tracking-widest text-[#9facc1]">ВВЕДИТЕ СВОЙ СИГНАЛ</div>
            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#bfc7cf]">arrow_forward</span>
          </div>
        </div>
        <div className="flex flex-col items-start text-left md:items-end md:text-right">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#6a768a]">Версия 4.0.2</div>
          <div className="max-w-[180px] text-[10px] uppercase tracking-widest text-[#9facc1]">
            Создано для молчаливого наблюдателя. Все права сохранены за Cold Mist Studio.
          </div>
        </div>
      </section>
    </ColdMistLayout>
  );
}

export function ColdMistGallery({ manifest, content, artworks }: ColdMistGalleryProps) {
  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="gallery">
      <ColdMistGalleryClient variantId={manifest.id} artworks={artworks} />
    </ColdMistLayout>
  );
}

export function ColdMistDetail({ manifest, content, artwork }: ColdMistDetailProps) {
  const detailShots = artwork.photos.slice(1, 4);

  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="detail">
      <div className="min-h-screen pt-0 pb-20 md:pb-0 flex flex-col md:flex-row relative">
        <div className="fixed inset-0 mist-gradient pointer-events-none" />

        <section className="w-full md:w-3/5 lg:w-2/3 h-[614px] md:h-screen sticky top-0 bg-[#0a0e14] flex items-center justify-center p-8 md:p-24 overflow-hidden">
          <div className="relative w-full h-full group">
            <div className="absolute inset-0 bg-[#121a25] shadow-[0_0_100px_rgba(0,0,0,0.8)] z-0" />
            <Image
              src={artwork.imageOriginal}
              alt={artwork.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="w-full h-full object-cover relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-1000 grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-8 left-8 z-30 flex items-center gap-4 text-[#9facc1]/60">
              <span className="material-symbols-outlined text-sm">zoom_in</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Увеличить</span>
            </div>
          </div>
        </section>

        <section className="w-full md:w-2/5 lg:w-1/3 bg-[#0e141c] min-h-screen z-10 px-8 py-16 md:px-16 md:py-32 flex flex-col justify-between">
          <div>
            <div className="mb-12">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#9facc1] block mb-4">
                {artwork.series ? `Серия / ${artwork.series}` : "Архив / основная работа"}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.05em] text-[#d9e6fd] leading-none mb-6 uppercase">
                {artwork.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-[#bfc7cf]" />
                <p className="text-sm font-medium uppercase tracking-widest text-[#bfc7cf]">{statusLabel(artwork.status)}</p>
              </div>
            </div>

            <div className="space-y-8 mb-16">
              <p className="text-lg text-[#d9e6fd] leading-relaxed font-light">{artwork.description}</p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#3c495b]/20">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9facc1] mb-1">Размер</p>
                  <p className="text-sm font-medium">{artwork.size}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9facc1] mb-1">Материал</p>
                  <p className="text-sm font-medium">{artwork.medium}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9facc1] mb-1">Год</p>
                  <p className="text-sm font-medium">{artwork.year}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9facc1] mb-1">Цена</p>
                  <p className="text-sm font-medium">{artworkPriceLabel(artwork)}</p>
                </div>
              </div>
            </div>

            {detailShots.length > 0 ? (
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#3c495b]/20 pt-8">
                {detailShots.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden bg-[#16202e]">
                    <Image src={photo.urlPreview} alt={artwork.title} fill sizes="20vw" className="object-cover opacity-85" />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-4">
              <Link href={`/${manifest.id}/contacts`} className="bg-[#bfc7cf] text-[#394148] py-6 px-8 text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#cdd5dd] transition-colors duration-400 active:scale-[0.98] text-center">
                {content.detail.inquiryLabel}
              </Link>
              <Link href={`/${manifest.id}/contacts`} className="bg-[#16202e] py-6 px-8 text-center text-sm uppercase tracking-[0.2em] font-medium text-[#d9e6fd] hover:bg-[#1e2d41] transition-colors duration-400">
                Запросить спецификацию
              </Link>
            </div>
          </div>

          <div className="mt-24">
            <p className="text-[10px] text-[#9facc1]/40 leading-relaxed uppercase tracking-tighter">
              Все работы сопровождаются зашифрованными цифровыми сертификатами. Cold Mist действует как суверенная сущность в кураторстве атмосферных цифровых артефактов.
            </p>
          </div>
        </section>
      </div>
    </ColdMistLayout>
  );
}

export function ColdMistAbout({ manifest, content }: ColdMistPageProps) {
  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="about">
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-12">
        <div className="mb-12 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#6a768a]">{content.about.eyebrow}</p>
          <h1 className="tight-tracking text-5xl font-black uppercase text-[#d9e6fd] md:text-7xl">Холодная редакционная практика</h1>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.25fr_0.75fr]">
          <article className="space-y-6 bg-[#121a25] p-10">
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-relaxed text-[#9facc1]">{paragraph}</p>
            ))}
          </article>
          <aside className="space-y-4 bg-[#0e141c] p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-[#6a768a]">Инварианты дизайна</p>
            <ul className="space-y-3 text-sm text-[#9facc1]">
              {manifest.designInvariants.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </ColdMistLayout>
  );
}

export function ColdMistContacts({ manifest, content }: ColdMistPageProps) {
  return (
    <ColdMistLayout manifest={manifest} content={content} currentRoute="contacts">
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-[480px] items-center px-6 py-16">
        <div className="w-full">
          <div className="mb-16">
            <h1 className="mb-2 text-[48px] font-black uppercase tracking-[-0.04em] text-[#d9e6fd]">Связь</h1>
            <p className="text-base leading-relaxed text-[#6a768a]">{content.contacts.description}</p>
          </div>
          <form className="space-y-8">
            {["Имя", "Email", "Тема"].map((label) => (
              <label key={label} className="block">
                <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-[#9facc1]">{label}</span>
                <input className="w-full border-0 border-b border-[#3c495b] bg-transparent px-0 py-3 text-[#d9e6fd] focus:border-[#bfc7cf] focus:shadow-none" placeholder=" " />
              </label>
            ))}
            <label className="block">
              <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-[#9facc1]">Сообщение</span>
              <textarea rows={4} className="w-full resize-none border-0 border-b border-[#3c495b] bg-transparent px-0 py-3 text-[#d9e6fd] focus:border-[#bfc7cf] focus:shadow-none" />
            </label>
            <button type="button" className="w-full bg-[#bfc7cf] py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#394148] transition hover:bg-[#cdd5dd]">
              {content.contacts.inquiryLabel}
            </button>
          </form>
        </div>
      </main>
    </ColdMistLayout>
  );
}
