"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

import { DeepImmersionAbout, DeepImmersionContacts, DeepImmersionDetail, DeepImmersionGallery, DeepImmersionHome } from "@/components/public/deep-immersion";
import { ColdMistAbout, ColdMistContacts, ColdMistDetail, ColdMistGallery, ColdMistHome } from "@/components/public/cold-mist";
import { CopperGlowAbout, CopperGlowContacts, CopperGlowDetail, CopperGlowGallery, CopperGlowHome } from "@/components/public/copper-glow";
import { EthericPulseAbout, EthericPulseContacts, EthericPulseDetail, EthericPulseGallery, EthericPulseHome } from "@/components/public/etheric-pulse";
import { MintRoseContacts, MintRoseDetail, MintRoseGallery, MintRoseHome } from "@/components/public/mint-rose";
import { OliveCreamContacts, OliveCreamDetail, OliveCreamGallery, OliveCreamHome } from "@/components/public/olive-cream";
import { SageSandAbout, SageSandContacts, SageSandDetail, SageSandGallery, SageSandHome } from "@/components/public/sage-sand";
import { VariantArtworkCard } from "@/components/public/variant-artwork-card";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { useDisplayArtworks, usePublicArtworkBySlug, usePublicSnapshot, useVariantContent, useVariantSiteAssets } from "@/components/public/public-site-provider";
import { getVariantManifest, variantManifests } from "@/features/variants/manifests";
import type { VariantRouteKey } from "@/features/variants/types";
import { artworkMeta, artworkPriceLabel, statusLabel } from "@/shared/format";

type VariantRouteClientProps = {
  variantId: string;
  route: VariantRouteKey;
  slug?: string;
};

export function VariantRouteClient({ variantId, route, slug }: VariantRouteClientProps) {
  const manifest = getVariantManifest(variantId);
  const content = useVariantContent(variantId);
  const _siteAssets = useVariantSiteAssets(variantId);
  const artworks = useDisplayArtworks();
  const artwork = slug ? usePublicArtworkBySlug(slug) : null;
  const { loading } = usePublicSnapshot();

  if (!manifest || !content) {
    return null;
  }

  assertVariantSupportsRoute(route, manifest.supportedRoutes);

  if (route === "home") {
    const featured = artworks.slice(0, 3);

    if (manifest.id === "deep-immersion") return <><DeepImmersionHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "cold-mist") return <><ColdMistHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "copper-glow") return <><CopperGlowHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "etheric-pulse") return <><EthericPulseHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "mint-rose") return <><MintRoseHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "olive-cream") return <><OliveCreamHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;
    if (manifest.id === "sage-sand") return <><SageSandHome manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="home" /></>;

    return (
      <>
        <VariantShell
          manifest={manifest}
          content={content}
          currentRoute="home"
          hero={
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-18 md:py-24 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] opacity-70">{content.home.eyebrow}</p>
                <h1 className="text-5xl font-semibold leading-none md:text-7xl">{content.home.title}</h1>
                <p className={`max-w-2xl text-lg ${manifest.classes.subtle}`}>{content.home.description}</p>
              </div>
            </div>
          }
        >
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">Selected works</p>
              <h2 className="text-3xl font-semibold md:text-5xl">Preview the frontend face without losing shared content continuity.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((featuredArtwork) => (
                <VariantArtworkCard key={featuredArtwork.id} variant={manifest} artwork={featuredArtwork} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${manifest.id}/gallery`} className={`px-5 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
                {content.home.primaryCta}
              </Link>
              <Link href={`/${manifest.id}/${manifest.supportedRoutes.includes("about") ? "about" : "contacts"}`} className={`border px-5 py-3 text-sm font-medium ${manifest.classes.pill}`}>
                {content.home.secondaryCta}
              </Link>
            </div>
          </section>
        </VariantShell>
        <VariantSwitcher currentVariantId={manifest.id} currentRoute="home" />
      </>
    );
  }

  if (route === "gallery") {
    if (manifest.id === "deep-immersion") return <><DeepImmersionGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "cold-mist") return <><ColdMistGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "copper-glow") return <><CopperGlowGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "etheric-pulse") return <><EthericPulseGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "mint-rose") return <><MintRoseGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "olive-cream") return <><OliveCreamGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;
    if (manifest.id === "sage-sand") return <><SageSandGallery manifest={manifest} content={content} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" /></>;

    return (
      <>
        <VariantShell manifest={manifest} content={content} currentRoute="gallery">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.gallery.eyebrow}</p>
              <h1 className="text-3xl font-semibold md:text-5xl">{content.gallery.title}</h1>
              <p className={`max-w-3xl text-base ${manifest.classes.subtle}`}>{content.gallery.description}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {artworks.map((galleryArtwork) => (
                <VariantArtworkCard key={galleryArtwork.id} variant={manifest} artwork={galleryArtwork} />
              ))}
            </div>
          </div>
        </VariantShell>
        <VariantSwitcher currentVariantId={manifest.id} currentRoute="gallery" />
      </>
    );
  }

  if (route === "about") {
    if (manifest.id === "deep-immersion") return <><DeepImmersionAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
    if (manifest.id === "cold-mist") return <><ColdMistAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
    if (manifest.id === "copper-glow") return <><CopperGlowAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
    if (manifest.id === "etheric-pulse") return <><EthericPulseAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
    if (manifest.id === "sage-sand") return <><SageSandAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;

    return (
      <>
        <VariantShell manifest={manifest} content={content} currentRoute="about">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.about.eyebrow}</p>
                <h1 className="text-3xl font-semibold md:text-5xl">{content.about.title}</h1>
              </div>
              <div className={`space-y-5 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
                {content.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8">{paragraph}</p>
                ))}
              </div>
            </div>
            <aside className={`space-y-4 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">Design invariants</p>
              <ul className={`space-y-3 text-sm ${manifest.classes.subtle}`}>
                {manifest.designInvariants.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </VariantShell>
        <VariantSwitcher currentVariantId={manifest.id} currentRoute="about" />
      </>
    );
  }

  if (route === "contacts") {
    if (manifest.id === "deep-immersion") return <><DeepImmersionContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "cold-mist") return <><ColdMistContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "copper-glow") return <><CopperGlowContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "etheric-pulse") return <><EthericPulseContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "mint-rose") return <><MintRoseContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "olive-cream") return <><OliveCreamContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
    if (manifest.id === "sage-sand") return <><SageSandContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;

    return (
      <>
        <VariantShell manifest={manifest} content={content} currentRoute="contacts">
          <div className="grid gap-6 md:grid-cols-2">
            <div className={`space-y-5 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.contacts.eyebrow}</p>
                <h1 className="text-3xl font-semibold md:text-5xl">{content.contacts.title}</h1>
                <p className={`text-base ${manifest.classes.subtle}`}>{content.contacts.description}</p>
              </div>
              <div className="space-y-3 text-sm">
                {content.contacts.channels.map((channel) => (
                  <p key={channel}>{channel}</p>
                ))}
              </div>
            </div>
            <div className={`space-y-4 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">Do not dilute</p>
              <ul className={`space-y-3 text-sm ${manifest.classes.subtle}`}>
                {manifest.doNotDilute.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <div className={`pt-4 ${manifest.classes.subtle}`}>
                <p className={`inline-flex px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>{content.contacts.inquiryLabel}</p>
              </div>
            </div>
          </div>
        </VariantShell>
        <VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" />
      </>
    );
  }

  if (!slug) {
    return null;
  }

  if (!artwork) {
    if (loading) {
      return <main className="min-h-screen bg-[#0b1017]" />;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b1017] px-6 text-center text-white">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.28em] text-white/50">Artwork not found</p>
          <Link href={`/${variantId}/gallery`} className="inline-flex border border-white/20 px-4 py-3 text-sm uppercase tracking-[0.18em] text-white/80">
            Вернуться в галерею
          </Link>
        </div>
      </main>
    );
  }

  if (manifest.id === "deep-immersion") return <><DeepImmersionDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "cold-mist") return <><ColdMistDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowDetail manifest={manifest} content={content} artwork={artwork} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "mint-rose") return <><MintRoseDetail manifest={manifest} content={content} artwork={artwork} artworks={artworks} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "olive-cream") return <><OliveCreamDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;
  if (manifest.id === "sage-sand") return <><SageSandDetail manifest={manifest} content={content} artwork={artwork} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} /></>;

  const detailShots = artwork.photos.slice(1, 4);

  return (
    <>
      <VariantShell manifest={manifest} content={content} currentRoute="detail">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:items-start">
          <div className={`${manifest.classes.card} ${manifest.classes.pill} overflow-hidden p-4`}>
            <div className={`relative aspect-[4/3] w-full overflow-hidden ${manifest.classes.artworkFrame}`}>
              <img src={artwork.imageOriginal} alt={artwork.title} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className={`space-y-6 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">Artwork detail</p>
              <h1 className="text-4xl font-semibold">{artwork.title}</h1>
              {artwork.series ? <p className={`text-xs uppercase tracking-[0.25em] ${manifest.classes.subtle}`}>{artwork.series}</p> : null}
              <p className={manifest.classes.subtle}>{artworkMeta(artwork)}</p>
            </div>
            <p className="text-base leading-8">{artwork.description}</p>
            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Status</span>
                <span className={`px-3 py-1 text-xs uppercase tracking-[0.15em] ${manifest.classes.accent} ${manifest.classes.pill}`}>{statusLabel(artwork.status)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Variant note</span>
                <span className={`max-w-[16rem] text-right ${manifest.classes.subtle}`}>{content.detail.note}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Price</span>
                <span className={manifest.classes.subtle}>{artworkPriceLabel(artwork)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-4">
                <span className="opacity-70">Inquiry</span>
                <Link href={`/${manifest.id}/contacts`} className={`px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
                  {content.detail.inquiryLabel}
                </Link>
              </div>
            </div>
            {detailShots.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 border-t border-black/10 pt-4">
                {detailShots.map((photo) => (
                  <div key={photo.id} className={`overflow-hidden ${manifest.classes.pill} ${manifest.classes.card}`}>
                    <img src={photo.urlPreview} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </VariantShell>
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="detail" slug={artwork.slug} />
    </>
  );
}

export function listStaticVariants() {
  return variantManifests.map((variant) => ({ variant: variant.id }));
}

function assertVariantSupportsRoute(route: VariantRouteKey, supportedRoutes: VariantRouteKey[]) {
  if (!supportedRoutes.includes(route)) {
    notFound();
  }
}
