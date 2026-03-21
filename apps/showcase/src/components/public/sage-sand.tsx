import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/features/artworks/types";
import { templateMedia } from "@/features/variants/template-media";
import { getAdminLoginHref } from "@/shared/admin";
import type { VariantContent, VariantManifest } from "@/features/variants/types";

type VariantProps = { manifest: VariantManifest; content: VariantContent };
type GalleryProps = VariantProps & { artworks: Artwork[] };
type DetailProps = VariantProps & { artwork: Artwork };

function SageLayout({ manifest, content, current, children }: VariantProps & { current: "home" | "gallery" | "detail" | "about" | "contacts"; children: React.ReactNode }) {
  const basePath = `/${manifest.id}`;
  const adminLoginHref = getAdminLoginHref();
  const nav = [
    { href: basePath, key: "home", label: content.nav.home },
    { href: `${basePath}/gallery`, key: "gallery", label: content.nav.gallery },
    { href: `${basePath}/about`, key: "about", label: content.nav.about },
    { href: `${basePath}/contacts`, key: "contacts", label: content.nav.contacts },
  ];

  return (
    <div className="min-h-screen bg-[#E8E2D2] text-[#2B3327]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <header className="sticky top-0 z-40 border-b border-[#A3A89F]/30 bg-[#E8E2D2]/80 px-10 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-4 font-semibold">
            <span className="text-[#7D8C74]">◆</span>
            <span>Sage &amp; Sand</span>
          </Link>
          <nav className="flex items-center gap-8">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className={item.key === current ? "border-b border-[#7D8C74] pb-1 text-[#7D8C74]" : "hover:text-[#7D8C74]"}>
                {item.label}
              </Link>
            ))}
            <Link
              href={adminLoginHref}
              className="grid size-10 place-items-center rounded-full border border-[#A3A89F]/30 text-[#7D8C74] transition hover:border-[#7D8C74] hover:bg-white/40"
              aria-label="Войти в админку"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

export function SageSandHome({ manifest, content }: VariantProps) {
  return (
    <SageLayout manifest={manifest} content={content} current="home">
      <main className="mx-auto max-w-[1200px] px-8 pb-24">
        <section className="mb-32 mt-12 flex flex-col-reverse items-center justify-between gap-12 md:mt-24 md:flex-row md:gap-20">
          <div className="z-10 flex max-w-xl flex-col gap-8">
            <h1 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight text-[#2B3327] md:text-[64px]" style={{ fontFamily: "Cormorant, serif" }}>
              Fluidity in <span className="italic text-[#7D8C74]">abstract</span> form
            </h1>
            <p className="text-lg leading-[1.6] text-[#2B3327]/80 md:text-[20px]">{content.home.description}</p>
            <Link href={`/${manifest.id}/gallery`} className="flex h-[50px] w-[180px] items-center justify-center rounded-full bg-[#7D8C74] text-[15px] font-medium text-[#F4F0E6] transition hover:-translate-y-0.5 hover:bg-[#D4A373]">
              {content.home.primaryCta}
            </Link>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-lg">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#7D8C74]/10" />
            <Image src={templateMedia.sageSand.hero} alt={content.home.title} fill className="rounded-[40%_60%_70%_30%/40%_50%_60%_50%] object-cover shadow-[0_20px_40px_rgba(43,51,39,0.05)]" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </section>

        <section className="mb-24">
          <div className="mb-8 flex items-center justify-between px-4">
            <h2 className="font-serif text-3xl italic" style={{ fontFamily: "Cormorant, serif" }}>Featured Works</h2>
            <Link href={`/${manifest.id}/gallery`} className="flex items-center gap-1 text-sm font-medium text-[#7D8C74]">
              View all <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto px-4 pb-8 pt-4">
            {templateMedia.sageSand.gallery.slice(0, 4).map((image, index) => (
              <div key={image} className={`min-w-[280px] snap-start group cursor-pointer md:min-w-[320px] ${index % 2 ? "mt-8" : ""}`}>
                <div className={`relative aspect-[3/4] overflow-hidden bg-[#F4F0E6] shadow-[0_20px_40px_rgba(43,51,39,0.05)] ${index === 1 ? "rounded-[32px]" : index === 2 ? "rounded-[40px]" : "rounded-[24px]"}`}>
                  <Image src={image} alt={`Sage Sand work ${index + 1}`} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="320px" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </SageLayout>
  );
}

export function SageSandGallery({ manifest, content, artworks }: GalleryProps) {
  return (
    <SageLayout manifest={manifest} content={content} current="gallery">
      <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 lg:px-24">
        <div className="relative mb-16 text-center">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#7D8C74]/15 blur-[20px]" />
          <h1 className="text-5xl font-light italic tracking-wide" style={{ fontFamily: "Cormorant, serif" }}>Collection</h1>
        </div>
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {["All", "Canvas", "Paper", "Available"].map((chip, index) => (
            <span key={chip} className={`rounded-full border border-[#7D8C74] px-6 py-2 text-sm font-medium ${index === 0 ? "bg-[#7D8C74] text-white" : "text-[#7D8C74]"}`}>
              {chip}
            </span>
          ))}
        </div>
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
          {templateMedia.sageSand.gallery.map((image, index) => {
            const artwork = artworks[index] ?? artworks[index % artworks.length];
            return (
              <Link key={`${artwork.slug}-${index}`} href={`/${manifest.id}/artwork/${artwork.slug}`} className="group mb-8 block break-inside-avoid cursor-pointer">
                <div className={`overflow-hidden bg-[#F4F0E6] p-4 transition duration-500 group-hover:bg-[#F4F0E6] group-hover:shadow-[0_20px_40px_rgba(43,51,39,0.05)] ${index % 3 === 0 ? "rounded-[24px_48px_32px_24px]" : index % 3 === 1 ? "rounded-[48px_24px_24px_40px]" : "rounded-[32px_32px_48px_24px]"}`}>
                  <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                  <div className="mt-6 px-2">
                    <h3 className="text-xl font-medium">{artwork.title}</h3>
                    <p className="text-sm text-[#A3A89F]">{artwork.medium}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </SageLayout>
  );
}

export function SageSandAbout({ manifest, content }: VariantProps) {
  return (
    <SageLayout manifest={manifest} content={content} current="about">
      <main className="mx-auto flex max-w-[680px] flex-col items-center gap-16 px-6 py-20">
        <section className="flex w-full flex-col items-center gap-10 text-center">
          <h1 className="font-serif text-5xl italic text-[#2B3327] md:text-6xl" style={{ fontFamily: "Cormorant, serif" }}>About the Artist</h1>
          <div className="relative h-[300px] w-[300px]">
            <div className="absolute inset-0 scale-105 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#7D8C74]/10 transition duration-700" />
            <Image src={templateMedia.sageSand.aboutPortrait} alt="Artist portrait" fill className="rounded-[40%_60%_70%_30%/40%_50%_60%_50%] object-cover sepia-[.3] brightness-95 shadow-[0_20px_40px_rgba(43,51,39,0.05)]" sizes="300px" />
          </div>
        </section>
        <section className="w-full space-y-6 text-[20px] leading-[1.8] text-[#2B3327]">
          <p>
            My work is an ongoing conversation between the structured and the formless. Born from a fascination with the tactile nature of the earth and the fluid emotions of the human experience, my abstract pieces aim to bridge the gap between what we see and what we feel.
          </p>
          <p>
            Every brushstroke is intuitive, guided by the music playing in my studio and the quality of natural light filtering through the windows.
          </p>
          <p>
            My goal is to create art that does not demand attention, but rather invites a quiet, sustained contemplation.
          </p>
        </section>
      </main>
    </SageLayout>
  );
}

export function SageSandDetail({ manifest, content, artwork }: DetailProps) {
  return (
    <SageLayout manifest={manifest} content={content} current="detail">
      <main className="mx-auto max-w-[1200px] px-6 py-16 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[32px] bg-[#F4F0E6] shadow-[0_20px_40px_rgba(43,51,39,0.05)]">
            <Image src={artwork.imageOriginal} alt={artwork.title} width={1400} height={1700} className="h-auto w-full object-cover" />
          </div>
          <div className="space-y-8 lg:pt-10">
            <h1 className="font-serif text-5xl italic" style={{ fontFamily: "Cormorant, serif" }}>{artwork.title}</h1>
            <div className="space-y-2 text-[#A3A89F]">
              <p>{artwork.medium}</p>
              <p>{artwork.size}</p>
              <p>{artwork.year}</p>
            </div>
            <p className="text-lg leading-relaxed text-[#2B3327]/85">{artwork.description}</p>
            <Link href={`/${manifest.id}/contacts`} className="inline-flex rounded-full bg-[#7D8C74] px-8 py-4 text-white transition hover:bg-[#D4A373]">
              {content.detail.inquiryLabel}
            </Link>
          </div>
        </div>
      </main>
    </SageLayout>
  );
}

export function SageSandContacts({ manifest, content }: VariantProps) {
  return (
    <SageLayout manifest={manifest} content={content} current="contacts">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[680px] items-center px-6 py-16">
        <div className="w-full rounded-[2rem] bg-[#F4F0E6] p-10 shadow-[0_20px_40px_rgba(43,51,39,0.05)]">
          <div className="mb-10 text-center">
            <h1 className="font-serif text-4xl italic md:text-5xl" style={{ fontFamily: "Cormorant, serif" }}>{content.contacts.title}</h1>
            <p className="mt-4 text-lg text-[#A3A89F]">{content.contacts.description}</p>
          </div>
          <form className="space-y-8">
            {["Your Name", "Email Address", "Subject"].map((label) => (
              <label key={label} className="block">
                <span className="mb-3 block text-sm text-[#A3A89F]">{label}</span>
                <input className="w-full border-0 border-b border-[#A3A89F]/30 bg-transparent px-0 py-3 focus:border-[#7D8C74] focus:shadow-none" placeholder=" " />
              </label>
            ))}
            <label className="block">
              <span className="mb-3 block text-sm text-[#A3A89F]">Message</span>
              <textarea rows={4} className="w-full resize-none border-0 border-b border-[#A3A89F]/30 bg-transparent px-0 py-3 focus:border-[#7D8C74] focus:shadow-none" />
            </label>
            <button type="button" className="w-full rounded-full bg-[#7D8C74] px-8 py-4 text-white transition hover:bg-[#D4A373]">
              Send Message
            </button>
          </form>
        </div>
      </main>
    </SageLayout>
  );
}
