"use client";

import Image from "next/image";
import Link from "@/components/public/showcase-link";

import type { Artwork } from "@/features/artworks/types";
import { OliveCreamGalleryClient } from "@/components/public/variant-gallery-clients";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import type { VariantContent, VariantManifest, VariantSiteAssets } from "@/features/variants/types";
import { artworkPriceLabel, statusLabel } from "@/shared/format";

type VariantProps = { manifest: VariantManifest; content: VariantContent; siteAssets?: VariantSiteAssets };
type GalleryProps = VariantProps & { artworks: Artwork[] };
type DetailProps = VariantProps & { artwork: Artwork };

function OliveLayout({ manifest, content, current, children }: VariantProps & { current: "home" | "gallery" | "detail" | "contacts"; children: React.ReactNode }) {
  const basePath = `/${manifest.id}`;
  const adminLoginHref = getAdminLoginHref();
  const items = [
    { label: content.nav.home, href: basePath, key: "home" },
    { label: content.nav.gallery, href: `${basePath}/gallery`, key: "gallery" },
    { label: content.nav.contacts, href: `${basePath}/contacts`, key: "contacts" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F2EFE9] text-[#2C2E27]" style={{ fontFamily: "Newsreader, serif" }}>
      <header className="relative z-30 mx-auto max-w-[1400px] px-6 py-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between rounded-full border border-[#E8E3D9] bg-[#F2EFE9]/80 px-6 py-4 shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)] backdrop-blur-sm">
          <Link href={basePath} className="flex items-center gap-3 text-xl font-bold italic">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#5ea50d] text-[#F2EFE9]">O</span>
            O&amp;C
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className={item.key === current ? "text-[#5ea50d]" : "text-[#9CA38F] hover:text-[#5ea50d]"}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link href={`${basePath}/contacts`} className="items-center gap-2 text-sm text-[#9CA38F] transition hover:text-[#5ea50d] md:flex">
              <span>Inquire</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              href={adminLoginHref}
              className="grid size-10 place-items-center rounded-full border border-[#E8E3D9] text-[#9CA38F] transition hover:border-[#5ea50d] hover:text-[#5ea50d]"
              aria-label="Войти в админку"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

export function OliveCreamHome({ manifest, content, siteAssets }: VariantProps) {
  const heroImage = siteAssets?.home.heroImage;

  return (
    <OliveLayout manifest={manifest} content={content} current="home">
      <main className="mx-auto max-w-[1400px] px-6 pb-24 md:px-12 lg:px-24">
        <section className="relative flex min-h-[870px] flex-col items-center justify-between gap-12 pb-20 pt-10 lg:flex-row lg:gap-24">
          <div className="z-20 flex flex-1 flex-col gap-8">
            <div className="max-w-2xl space-y-6">
              <span className="pl-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#5ea50d]">Exhibition 2024</span>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-[84px]">
                Texture.<br />
                <span className="font-light italic text-[#9CA38F]">Emotion.</span><br />
                Form.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-[#9CA38F] md:text-xl">{content.home.description}</p>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <Link href={`/${manifest.id}/gallery`} className="group flex items-center justify-center gap-3 rounded-full bg-[#5ea50d] px-8 py-4 text-lg font-semibold text-[#F2EFE9] shadow-[0_20px_40px_-10px_rgba(94,165,13,0.08)] transition hover:bg-[#2C2E27]">
                <span>{content.home.primaryCta}</span>
                <span className="material-symbols-outlined transition group-hover:translate-x-1">east</span>
              </Link>
            </div>
          </div>
          <div className="relative flex flex-1 justify-center lg:justify-end">
            <div className="absolute inset-0 scale-110 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#E8E3D9] opacity-60 blur-xl" />
            <div className="relative aspect-[4/5] w-full max-w-[500px]">
              <Image
                src={heroImage?.url ?? templateMedia.oliveCream.hero}
                alt={heroImage?.alt || content.home.title}
                fill
                className="rounded-[60%_40%_30%_70%/60%_30%_70%_40%] object-cover shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute -bottom-6 -left-6 z-20 flex items-center gap-4 rounded-full border border-[#E8E3D9] bg-[#F2EFE9] p-4 shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)]">
                <div className="h-12 w-12 overflow-hidden rounded-full">
                  <Image src={templateMedia.oliveCream.badge} alt="Artist badge" width={80} height={80} className="h-full w-full object-cover grayscale" />
                </div>
                <div>
                  <p className="text-sm font-bold">E. Vance</p>
                  <p className="text-xs italic text-[#9CA38F]">Lead Artist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="-mx-6 bg-[#E8E3D9]/35 px-6 py-20 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-3xl font-bold italic tracking-tight md:text-5xl">Recent Works</h2>
            <Link href={`/${manifest.id}/gallery`} className="hidden items-center gap-2 font-medium text-[#5ea50d] transition hover:text-[#2C2E27] md:flex">
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="flex w-full gap-8 overflow-x-auto pb-12 pt-4">
            {templateMedia.oliveCream.gallery.slice(0, 3).map((image, index) => (
              <div key={image} className={`group min-w-[280px] cursor-pointer gap-6 md:min-w-[350px] ${index === 1 ? "pt-12" : ""}`}>
                <div className={`overflow-hidden shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)] ${index === 0 ? "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" : index === 1 ? "rounded-[50%_50%_30%_70%/70%_40%_60%_30%]" : "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"}`}>
                  <Image src={image} alt={`Olive Cream work ${index + 1}`} width={900} height={1100} className="h-auto w-full object-cover transition duration-1000 group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </OliveLayout>
  );
}

export function OliveCreamGallery({ manifest, content, artworks }: GalleryProps) {
  return (
    <OliveLayout manifest={manifest} content={content} current="gallery">
      <OliveCreamGalleryClient variantId={manifest.id} artworks={artworks} />
    </OliveLayout>
  );
}

export function OliveCreamDetail({ manifest, content, artwork }: DetailProps) {
  const detailShots = artwork.photos.slice(1, 4);

  return (
    <OliveLayout manifest={manifest} content={content} current="detail">
      <main className="flex min-h-screen flex-col pt-4 lg:flex-row">
        <section className="sticky top-0 flex w-full items-center justify-center overflow-hidden bg-[#E8E3D9] lg:h-screen lg:w-[60%]">
          <div className="relative h-[614px] w-full lg:h-full">
            <Image src={artwork.imageOriginal} alt={artwork.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>
        </section>
        <section className="min-h-screen w-full bg-[#F2EFE9] px-6 py-12 md:px-16 lg:w-[40%] lg:px-20 lg:py-24">
          <div className="mx-auto flex h-full max-w-xl flex-col">
            <div className="mb-12">
              <h1 className="text-5xl font-bold leading-none md:text-6xl lg:text-[72px]">{artwork.title}</h1>
              <div className="mt-6 border-l-2 border-[#5ea50d] pl-4 py-1 text-base italic text-[#9CA38F]">
                {artwork.medium}, {artwork.size}, {artwork.year}
              </div>
              {artwork.series ? <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[#5ea50d]">{artwork.series}</p> : null}
            </div>
            <div className="flex-grow space-y-6 text-lg leading-relaxed text-[#2C2E27]/90">
              <p>{artwork.description}</p>
              <p className="italic text-[#9CA38F]">{content.detail.note}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-[#E8E3D9] px-4 py-3">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#9CA38F]">Статус</div>
                  <div>{statusLabel(artwork.status)}</div>
                </div>
                <div className="rounded-2xl bg-[#E8E3D9] px-4 py-3">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-[#9CA38F]">Цена</div>
                  <div>{artworkPriceLabel(artwork)}</div>
                </div>
              </div>
              {detailShots.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {detailShots.map((photo) => (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                      <Image src={photo.urlPreview} alt={artwork.title} fill sizes="20vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <Link href={`/${manifest.id}/contacts`} className="mt-16 block rounded-full bg-[#5ea50d] px-8 py-5 text-center text-lg font-semibold text-[#F2EFE9] shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)] transition hover:bg-[#7D8F66]">
              {content.detail.inquiryLabel}
            </Link>
          </div>
        </section>
      </main>
    </OliveLayout>
  );
}

export function OliveCreamContacts({ manifest, content }: VariantProps) {
  return (
    <OliveLayout manifest={manifest} content={content} current="contacts">
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center px-6 py-16">
        <div className="w-full rounded-[2rem] bg-[#E8E3D9] p-10 shadow-[0_20px_40px_-10px_rgba(90,107,71,0.08)] md:p-14">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{content.contacts.title}</h1>
            <p className="mt-4 text-lg italic text-[#9CA38F]">{content.contacts.description}</p>
          </div>
          <form className="space-y-8">
            {["Full Name", "Email Address", "Subject"].map((label) => (
              <label key={label} className="block">
                <span className="mb-3 block text-sm italic text-[#9CA38F]">{label}</span>
                <input className="block w-full border-0 border-b-2 border-[#9CA38F]/30 bg-transparent px-0 py-3 focus:border-[#5ea50d] focus:shadow-none" placeholder=" " />
              </label>
            ))}
            <label className="block">
              <span className="mb-3 block text-sm italic text-[#9CA38F]">Message</span>
              <textarea rows={4} className="block w-full resize-none border-0 border-b-2 border-[#9CA38F]/30 bg-transparent px-0 py-3 focus:border-[#5ea50d] focus:shadow-none">I am interested in acquiring this piece.</textarea>
            </label>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5ea50d] px-8 py-4 text-lg font-semibold text-[#F2EFE9] transition hover:bg-[#7D8F66]">
              <span>Send Inquiry</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>
        </div>
      </main>
    </OliveLayout>
  );
}
