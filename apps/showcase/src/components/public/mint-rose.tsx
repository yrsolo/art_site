"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "@/components/public/showcase-link";

import type { Artwork } from "@/features/artworks/types";
import { MintRoseGalleryClient } from "@/components/public/variant-gallery-clients";
import type { VariantContent, VariantManifest, VariantRouteKey } from "@/features/variants/types";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import { artworkPriceLabel, statusLabel } from "@/shared/format";

type MintRoseLayoutProps = {
  manifest: VariantManifest;
  content: VariantContent;
  currentRoute: VariantRouteKey;
  children: ReactNode;
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

function buildNavItems(manifest: VariantManifest, content: VariantContent) {
  const basePath = `/${manifest.id}`;

  return [
    { key: "home" as const, href: basePath, label: content.nav.home },
    { key: "gallery" as const, href: `${basePath}/gallery`, label: content.nav.gallery },
    { key: "contacts" as const, href: `${basePath}/contacts`, label: content.nav.contacts },
  ].filter((item) => manifest.supportedRoutes.includes(item.key));
}

function MintRoseLayout({ manifest, content, currentRoute, children }: MintRoseLayoutProps) {
  const navItems = buildNavItems(manifest, content);
  const adminLoginHref = getAdminLoginHref();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f9ecec] text-[#4a403a] selection:bg-[#98d8c8]/40 selection:text-[#30423b]">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-[#98d8c8]/20 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#e8a5a5]/20 blur-3xl" />

      <header className="relative z-20 mx-auto max-w-[1200px] px-4 pb-8 pt-5 md:px-10 lg:px-16">
        <div className="mb-10 flex items-center justify-between rounded-full bg-[rgba(255,245,245,0.6)] px-4 py-6 shadow-[0_20px_40px_rgba(74,64,58,0.05)] backdrop-blur-xl md:px-10 md:mb-20">
          <div className="flex items-center gap-4">
            <div className="grid h-6 w-6 place-items-center text-[#13ecb6]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12 2.5l1.8 5.7L19.5 10l-5.7 1.8L12 17.5l-1.8-5.7L4.5 10l5.7-1.8L12 2.5z" />
              </svg>
            </div>
            <Link href={`/${manifest.id}`} className="text-xl font-bold tracking-[-0.02em] text-[#4a403a]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
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
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={adminLoginHref}
              className="grid size-10 place-items-center rounded-full border border-[#4a403a]/10 bg-white/40 text-[#4a403a] transition-colors hover:border-[#13ecb6] hover:text-[#13ecb6]"
              aria-label="Войти в админку"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </Link>
            <span className="md:hidden">MENU</span>
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}

export function MintRoseHome({ manifest, content }: MintRosePageProps) {
  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="home">
      <section className="mx-auto max-w-[1200px] px-4 pb-20 md:px-10 lg:px-16">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-20">
          <div className="z-10 flex flex-col gap-8 text-center lg:w-1/2 lg:text-left">
            <div className="flex flex-col gap-6">
              <h1 className="text-5xl italic leading-tight tracking-[-0.033em] md:text-6xl lg:text-[64px]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                Emotions in Pigment
              </h1>
              <p className="mx-auto max-w-lg text-lg font-light leading-relaxed text-[#4a403a]/80 lg:mx-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                {content.home.description}
              </p>
            </div>
            <div className="flex justify-center pt-4 lg:justify-start">
              <Link
                href={`/${manifest.id}/gallery`}
                className="group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#13ecb6] px-8 py-4 text-base uppercase tracking-[0.125em] text-[#10221d] transition-all duration-300 hover:bg-[#e2f2ef] hover:text-[#13ecb6] hover:shadow-[0_0_30px_rgba(19,236,182,0.4)]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                View Collection
                <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[500px] justify-center lg:w-1/2 lg:max-w-none lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-h-[700px] md:aspect-square lg:aspect-[4/5]">
              <div className="absolute inset-0 translate-x-4 translate-y-4 animate-pulse rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#13ecb6]/30 blur-2xl opacity-60" />
              <div className="relative z-10 h-full w-full overflow-hidden rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-4 border-white/40 bg-[rgba(255,245,245,0.6)] shadow-[0_20px_40px_rgba(74,64,58,0.15)] backdrop-blur-xl">
                <Image
                  src={templateMedia.mintRose.hero}
                  alt="Abstract fluid art painting in mint and rose colors"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                />
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
      <MintRoseGalleryClient variantId={manifest.id} artworks={artworks} />
    </MintRoseLayout>
  );
}

export function MintRoseDetail({ manifest, content, artwork, artworks }: MintRoseDetailProps) {
  const detailShots = artwork.photos.slice(1, 3);
  const relatedArtworks = artworks.filter((item) => item.id !== artwork.id).slice(0, 2);

  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="detail">
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
          <h1 className="mb-6 text-4xl font-light tracking-tight text-slate-900 md:text-5xl lg:text-6xl" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {artwork.title}
          </h1>
          {artwork.series ? (
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-[#b48c8c]" style={{ fontFamily: "Outfit, sans-serif" }}>
              Серия: {artwork.series}
            </p>
          ) : null}
          <div className="mb-10 flex flex-col gap-2 font-medium tracking-wide text-slate-500" style={{ fontFamily: "Outfit, sans-serif" }}>
            <p>{artwork.medium}</p>
            <p>{artwork.size}</p>
            <p>{artwork.year}</p>
            <p>{statusLabel(artwork.status)}</p>
            <p>{artworkPriceLabel(artwork)}</p>
          </div>
          <div className="prose prose-lg mb-12 max-w-none font-light leading-relaxed text-slate-700" style={{ fontFamily: "Outfit, sans-serif" }}>
            <p>{artwork.description}</p>
          </div>
          <Link
            href={`/${manifest.id}/contacts`}
            className="mb-20 block w-full rounded-full bg-[#13ecb6] py-5 text-center text-lg font-bold text-[#10221d] shadow-lg transition-colors hover:bg-[#13ecb6]/90"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            {content.detail.inquiryLabel}
          </Link>

          <div className="space-y-8">
            <h3 className="border-b border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400" style={{ fontFamily: "Manrope, sans-serif" }}>
              Texture &amp; Detail
            </h3>
            <div className="grid grid-cols-2 items-start gap-6">
              {detailShots[0] || relatedArtworks[0] ? (
                <div className="mt-12">
                  <Image
                    src={detailShots[0]?.urlPreview ?? relatedArtworks[0]?.imagePreview ?? artwork.imagePreview}
                    alt={artwork.title}
                    width={600}
                    height={800}
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="aspect-[3/4] w-full rounded-lg border border-slate-100 object-cover shadow-md"
                  />
                </div>
              ) : null}
              {detailShots[1] || relatedArtworks[1] ? (
                <div>
                  <Image
                    src={detailShots[1]?.urlPreview ?? relatedArtworks[1]?.imagePreview ?? artwork.imagePreview}
                    alt={artwork.title}
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

export function MintRoseContacts({ manifest, content }: MintRosePageProps) {
  return (
    <MintRoseLayout manifest={manifest} content={content} currentRoute="contacts">
      <main className="relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-[600px] items-center justify-center px-4 pb-12">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[radial-gradient(circle_at_center,_rgba(19,236,182,0.3)_0%,_rgba(19,236,182,0)_70%)]" />
        <div className="w-full rounded-[3rem] bg-[rgba(255,245,245,0.6)] p-10 shadow-[0_20px_40px_rgba(74,64,58,0.05)] backdrop-blur-[20px] md:p-14">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-light tracking-tight text-[#4A403A] md:text-5xl">Let&apos;s Connect</h1>
            <p className="text-lg font-light text-[#BCAAA4]">{content.contacts.description}</p>
          </div>
          <form className="space-y-8">
            {["Your Name", "Email Address", "Subject"].map((label, index) => (
              <label key={label} className="relative block">
                <span className="absolute left-0 top-3 text-lg text-[#BCAAA4]">{label}</span>
                <input
                  className="peer w-full border-0 border-b border-[#BCAAA4] bg-transparent px-0 py-3 text-lg text-[#4A403A] placeholder-transparent focus:border-b-2 focus:border-[#13ecb6] focus:ring-0"
                  placeholder=" "
                  defaultValue={index === 2 ? "Inquiry: Serenity in Chaos" : ""}
                />
              </label>
            ))}
            <label className="relative mt-12 block">
              <span className="absolute left-0 top-3 text-lg text-[#BCAAA4]">Your Message</span>
              <textarea className="peer w-full resize-none border-0 border-b border-[#BCAAA4] bg-transparent px-0 py-3 text-lg text-[#4A403A] placeholder-transparent focus:border-b-2 focus:border-[#13ecb6] focus:ring-0" rows={4} placeholder=" " />
            </label>
            <div className="pt-6 text-center">
              <button type="button" className="min-w-[200px] rounded-full bg-[#13ecb6] px-10 py-4 text-base font-medium uppercase tracking-[2px] text-[#10221d] transition hover:bg-[#13ecb6]/80 hover:shadow-[0_0_20px_rgba(19,236,182,0.4)]">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>
    </MintRoseLayout>
  );
}
