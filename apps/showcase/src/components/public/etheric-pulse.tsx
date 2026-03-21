import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { artworkPriceLabel, statusLabel } from "@/shared/format";

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

const adminLoginHref = getAdminLoginHref();

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
          <Link href={`/${manifest.id}`} className="font-[Manrope] text-2xl font-bold tracking-tight text-[#e1e4fb] transition-colors hover:text-[#a894ff]">
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
          <Link
            href={adminLoginHref}
            className="rounded-full p-2 text-[#e1e4fb] hover:bg-white/5"
            aria-label="Войти в админку"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </header>
      <main className="relative z-10 pt-24">{children}</main>
    </div>
  );
}

function EthericFooter() {
  return (
    <footer className="w-full bg-transparent py-20">
      <div className="flex w-full flex-col items-center gap-12 px-4">
        <div className="flex flex-wrap justify-center gap-12 text-sm uppercase tracking-widest">
          {["Инстаграм", "Вимео", "Архив"].map((item) => (
            <a key={item} href="#" className="text-[#e1e4fb]/40 transition-all duration-700 hover:text-[#a894ff] hover:tracking-[0.2em]">
              {item}
            </a>
          ))}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#e1e4fb]/40">© 2024 Потоки энергии. Создано в тишине.</p>
      </div>
    </footer>
  );
}

export function EthericPulseHome({ manifest, content }: VariantProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="home">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <Image
          src={templateMedia.ethericPulse.hero}
          alt={content.home.title}
          fill
          priority
          className="object-cover opacity-40 mix-blend-lighten"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e17] via-[#0c0e17]/40 to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="mb-6 inline-block text-sm uppercase tracking-[0.4em] text-[#82d3dc]/90">Истоки энергии</span>
          <h1 className="mb-8 font-[Manrope] text-6xl font-extrabold leading-[0.94] tracking-[-0.05em] md:text-8xl lg:text-9xl">
            Искусство как{" "}
            <span className="bg-gradient-to-r from-[#a894ff] via-[#c6b7ff] to-[#82d3dc] bg-clip-text text-transparent">поток</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#b9c0d7]">
            Погрузитесь в пространство, где материя встречается с духом. Каждое произведение - это запечатлённый момент вечного движения.
          </p>
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
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#ffd6d6]">Коллекция 2024</p>
              <h2 className="font-[Manrope] text-3xl font-bold">Вибрации пустоты</h2>
              <p className="mt-4 max-w-md text-[#a7aac0]">Более мягкая тёмная структура, где интерфейс отступает, а импульс изображения становится главным источником света.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:col-span-5">
          <article className="flex flex-1 flex-col justify-end rounded-[1.75rem] bg-[#1b1f2e] p-8">
            <span className="material-symbols-outlined mb-6 text-4xl text-[#82d3dc]/70">auto_awesome</span>
            <h3 className="mb-2 font-[Manrope] text-2xl font-semibold">Медитативное созерцание</h3>
            <p className="text-[#a7aac0]">Стеклянные панели, округлые импульсы и ритм просмотра, настроенный на дыхание, а не на суровость сетки.</p>
          </article>
          <div className="relative h-[300px] overflow-hidden rounded-[1.75rem] bg-[#10131d]">
            <Image src={templateMedia.ethericPulse.secondary} alt="Secondary energy artwork" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover grayscale transition duration-1000 hover:grayscale-0" />
          </div>
        </div>
      </section>

      <section className="px-8 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-12 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#a894ff]/20">
              <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-t-2 border-[#a894ff]" />
              <span className="material-symbols-outlined text-3xl text-[#a894ff]">flare</span>
            </div>
          </div>
          <h2 className="font-[Manrope] text-4xl font-light leading-snug text-[#e1e4fb] md:text-5xl">
            «Энергия не исчезает, она лишь <br />
            <span className="font-normal italic text-[#ffd6d6]">превращается</span> в форму».
          </h2>
          <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#434759] to-transparent" />
        </div>
      </section>

      <EthericFooter />
    </EthericPulseLayout>
  );
}

export function EthericPulseGallery({ manifest, content, artworks }: GalleryProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="gallery">
      <section className="mx-auto max-w-screen-2xl px-6 pb-24 pt-8 md:px-12 lg:px-24">
        <div className="mb-16 space-y-6">
          <h1 className="font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] md:text-7xl">Галерея потоков</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#a7aac0]">
            Исследуйте визуализацию чистой энергии. Каждое произведение - это запечатлённое мгновение духовного движения и безмолвного ритма вселенной.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <span className="rounded-full bg-[#a894ff] px-6 py-2 text-sm text-[#190055]">Все потоки</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Вибрации</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Тишина</span>
            <span className="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]">Трансцендентность</span>
            <div className="ml-auto hidden items-center gap-2 text-sm uppercase tracking-widest text-[#82d3dc] opacity-80 md:flex">
              <span className="material-symbols-outlined text-base">filter_list</span>
              <span>Сортировка</span>
            </div>
          </div>
        </div>
        <div className="columns-1 gap-8 md:columns-2 xl:columns-3">
          {templateMedia.ethericPulse.gallery.map((image, index) => {
            const artwork = artworks[index] ?? artworks[index % artworks.length];
            return (
              <Link key={`${artwork.slug}-${index}`} href={`/${manifest.id}/artwork/${artwork.slug}`} className="group relative mb-8 block break-inside-avoid overflow-hidden rounded-[1.75rem] bg-[#10131d]">
                <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1200} className="h-auto w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent p-8 opacity-0 transition duration-500 group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#82d3dc]">{artwork.year}</p>
                  <h3 className="mt-2 font-[Manrope] text-2xl font-bold">{artwork.title}</h3>
                  <p className="mt-1 text-sm text-[#ffd6d6]/80">{artwork.medium}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-24 flex justify-center">
          <button type="button" className="group relative overflow-hidden rounded-full px-12 py-4 transition-all duration-500">
            <div className="absolute inset-0 bg-[#212536] opacity-50 transition-opacity group-hover:opacity-80" />
            <div className="relative flex items-center gap-3 font-medium text-[#e1e4fb]">
              <span>Погрузиться глубже</span>
              <span className="material-symbols-outlined text-[#a894ff] transition-transform group-hover:translate-y-1">expand_more</span>
            </div>
          </button>
        </div>
      </section>

      <EthericFooter />
    </EthericPulseLayout>
  );
}

export function EthericPulseAbout({ manifest, content }: VariantProps) {
  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="about">
      <main className="relative mx-auto max-w-screen-2xl overflow-hidden px-6 pb-24 pt-8 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <div className="group relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#a894ff]/10 blur-2xl transition duration-700 group-hover:bg-[#a894ff]/20" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#161926]">
              <Image src={templateMedia.ethericPulse.portrait} alt="Etheric Pulse portrait" width={1200} height={1500} className="aspect-[4/5] w-full object-cover opacity-90 transition duration-1000 group-hover:scale-105" />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden max-w-xs rounded-[1.75rem] border border-white/5 bg-[rgba(22,25,38,0.6)] p-8 shadow-2xl backdrop-blur-xl lg:block">
              <p className="font-[Manrope] text-lg italic leading-relaxed text-[#82d3dc]">
                "Моя задача - уловить вибрацию, которая существует до того, как появится форма."
              </p>
            </div>
          </div>
          <div className="space-y-8 pt-6">
            <p className="text-sm uppercase tracking-[0.3em] text-[#82d3dc]">Проводник • Пространство • Поток</p>
            <h1 className="font-[Manrope] text-6xl font-bold leading-[0.92] tracking-[-0.05em]">
              Эфирный <span className="text-[#a38dff]">Проводник</span>
            </h1>
            <p className="text-2xl font-light leading-relaxed text-[#e1e4fb]">
              Её искусство не создаётся в привычном смысле - оно <span className="text-[#ffd6d6]">протекает сквозь неё</span>, превращая невидимые потоки энергии в осязаемые полотна.
            </p>
            <p className="max-w-xl text-lg leading-[1.8] text-[#a7aac0]">
              Работая в медитативном состоянии, она использует свет и цвет как инструменты для визуализации метафизических процессов. Каждая картина является отпечатком моментального энергетического состояния пространства.
            </p>
            <div className="pt-8">
              <Link href={`/${manifest.id}/gallery`} className="rounded-full bg-[#a894ff] px-10 py-4 font-medium text-[#190055] shadow-[0_0_30px_rgba(168,148,255,0.3)] transition-all hover:scale-[1.02]">
                Посмотреть работы
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="rounded-[1.75rem] border border-white/5 bg-[rgba(22,25,38,0.6)] p-12 backdrop-blur-xl md:col-span-8">
            <h3 className="mb-8 font-[Manrope] text-3xl font-bold">Философия</h3>
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#a38dff]">Вибрация</span>
                <p className="leading-relaxed text-[#a7aac0]">Искусство как резонанс. Каждое произведение настраивает зрителя на определённую частоту, способствуя внутреннему исцелению и расширению сознания.</p>
              </div>
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#82d3dc]">Тишина</span>
                <p className="leading-relaxed text-[#a7aac0]">В основе каждого движения кисти лежит абсолютная неподвижность. Только из тишины может родиться истинный поток.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between rounded-[1.75rem] bg-[#1b1f2e] p-12 text-center md:col-span-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#a894ff]/20 blur-xl animate-pulse" />
              <span className="material-symbols-outlined text-6xl text-[#a894ff]">auto_awesome</span>
            </div>
            <div>
              <div className="mb-2 font-[Manrope] text-5xl font-bold">12+</div>
              <div className="text-sm uppercase tracking-widest text-[#a7aac0]">лет практики</div>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-[#10131d] p-12 md:col-span-5">
            <h3 className="mb-8 font-[Manrope] text-3xl font-bold">Путь</h3>
            <ul className="space-y-8">
              {[
                ["2012", "Окончание Академии Искусств, переход от академического реализма к абстрактному экспрессионизму."],
                ["2018", "Экспедиция в Гималаи, начало серии «Эфирные Потоки»."],
                ["2023", "Создание собственной студии-галереи в тихом пригороде."],
              ].map(([year, text]) => (
                <li key={year} className="flex gap-6">
                  <span className="font-[Manrope] text-xl font-bold text-[#a894ff]">{year}</span>
                  <p className="text-sm leading-relaxed text-[#a7aac0]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] border border-white/5 bg-[rgba(22,25,38,0.6)] p-12 backdrop-blur-xl md:col-span-7">
            <div className="mb-10 flex items-center justify-between">
              <h3 className="font-[Manrope] text-3xl font-bold">Выставки</h3>
              <span className="material-symbols-outlined text-[#a7aac0]">explore</span>
            </div>
            <div className="space-y-6">
              {[
                ["Сольная выставка «Люминесценция»", "Галерея современного искусства Парижа • 2024"],
                ["Дух формы", "Tokyo Contemporary • 2023"],
                ["Сдвиг вибрации", "Berlin Art Week • 2022"],
              ].map(([title, place]) => (
                <div key={title} className="group flex items-center justify-between border-b border-[#434759]/20 py-4 transition-colors hover:border-[#a894ff]/50">
                  <div>
                    <h4 className="text-lg font-medium text-[#e1e4fb]">{title}</h4>
                    <p className="text-sm text-[#a7aac0]">{place}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#a894ff] opacity-0 transition-opacity group-hover:opacity-100">arrow_outward</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-32 h-px w-full bg-gradient-to-r from-transparent via-[#a894ff] to-transparent" />
        <div className="mx-auto max-w-2xl space-y-8 py-24 text-center">
          <span className="material-symbols-outlined text-4xl text-[#a894ff]">filter_vintage</span>
          <p className="font-[Manrope] text-3xl font-light italic leading-relaxed text-[#e1e4fb]">
            «Каждое полотно - это открытый диалог между душой и бесконечностью».
          </p>
        </div>
      </main>

      <EthericFooter />
    </EthericPulseLayout>
  );
}

export function EthericPulseDetail({ manifest, content, artwork }: DetailProps) {
  const detailShots = artwork.photos.slice(1, 4);

  return (
    <EthericPulseLayout manifest={manifest} content={content} currentRoute="detail">
      <main className="mx-auto flex max-w-[1920px] flex-col gap-16 px-8 pb-16 pt-[120px] lg:flex-row lg:gap-24 lg:px-16">
        <div className="flex w-full justify-center lg:w-[65%]">
          <div className="group relative w-full max-w-[900px] cursor-zoom-in">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,_rgba(168,148,255,0.16),_rgba(7,9,15,0)_70%)] blur-[120px]" />
            <Image src={artwork.imageOriginal} alt={artwork.title} width={1400} height={1800} className="h-[819px] w-full border border-[#12151e] object-cover shadow-2xl transition duration-700 group-hover:scale-[1.02]" />
          </div>
        </div>
        <aside className="w-full lg:w-[35%]">
          <div className="sticky top-[120px] flex flex-col gap-8">
            <div>
              <h1 className="font-[Manrope] text-5xl font-bold leading-tight">{artwork.title}</h1>
              <p className="mt-2 text-lg text-[#5A657A]">{artwork.year}</p>
              {artwork.series ? <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#82d3dc]">{artwork.series}</p> : null}
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
              <div>
                <p className="text-[13px] uppercase tracking-[0.05em] text-[#5A657A]">Статус</p>
                <p>{statusLabel(artwork.status)}</p>
              </div>
              <div>
                <p className="text-[13px] uppercase tracking-[0.05em] text-[#5A657A]">Цена</p>
                <p>{artworkPriceLabel(artwork)}</p>
              </div>
            </div>
            <p className="text-lg leading-relaxed">{artwork.description}</p>
            {detailShots.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {detailShots.map((photo) => (
                  <div key={photo.id} className="relative aspect-square overflow-hidden rounded-[1rem] border border-[#12151e] bg-[#10131d]">
                    <Image src={photo.urlPreview} alt={artwork.title} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
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
            <button type="button" className="flex h-12 w-full items-center justify-center gap-3 border border-[#5A657A]/30 bg-[#12151E] font-['Cabinet Grotesk'] text-[14px] uppercase tracking-[0.1em] text-[#F1F4F9] transition hover:border-[#1378ec] hover:bg-[#1378ec]">
              <span>Отправить</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        </div>
      </main>
    </EthericPulseLayout>
  );
}
