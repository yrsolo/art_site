"use client";

import Image from "next/image";
import Link from "next/link";

import { useGalleryBrowser } from "@/components/public/gallery-browser";
import type { Artwork } from "@/features/artworks/types";

function DarkControls({
  groupMode,
  setMode,
  collapseAll,
  expandAll,
  accentClass,
}: {
  groupMode: "all" | "year" | "series";
  setMode: (mode: "all" | "year" | "series") => void;
  collapseAll: () => void;
  expandAll: () => void;
  accentClass: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {[
        ["all", "Все"],
        ["year", "По году"],
        ["series", "По серии"],
      ].map(([value, label]) => (
        <button key={value} className={groupMode === value ? accentClass : "text-[#aab6c9]"} type="button" onClick={() => setMode(value as "all" | "year" | "series")}>
          {label}
        </button>
      ))}
      {groupMode !== "all" ? (
        <>
          <span className="h-4 w-px bg-white/10" />
          <button className="text-xs uppercase tracking-[0.18em] text-[#aab6c9]" type="button" onClick={collapseAll}>
            Свернуть все
          </button>
          <button className="text-xs uppercase tracking-[0.18em] text-[#aab6c9]" type="button" onClick={expandAll}>
            Развернуть все
          </button>
        </>
      ) : null}
    </div>
  );
}

function OrganicControls({
  groupMode,
  setMode,
  collapseAll,
  expandAll,
  activeClass,
  idleClass,
}: {
  groupMode: "all" | "year" | "series";
  setMode: (mode: "all" | "year" | "series") => void;
  collapseAll: () => void;
  expandAll: () => void;
  activeClass: string;
  idleClass: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {[
        ["all", "Все"],
        ["year", "По году"],
        ["series", "По серии"],
      ].map(([value, label]) => (
        <button key={value} className={groupMode === value ? activeClass : idleClass} type="button" onClick={() => setMode(value as "all" | "year" | "series")}>
          {label}
        </button>
      ))}
      {groupMode !== "all" ? (
        <>
          <button className={idleClass} type="button" onClick={collapseAll}>
            Свернуть все
          </button>
          <button className={idleClass} type="button" onClick={expandAll}>
            Развернуть все
          </button>
        </>
      ) : null}
    </div>
  );
}

export function CopperGlowGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <section className="mx-auto max-w-[96rem] px-8 pb-24 pt-10">
      <header className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h1 className="mb-6 text-6xl font-bold uppercase leading-none tracking-[-0.06em] text-[#e8be9f] md:text-8xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Кураторские
            <br />
            видения
          </h1>
          <p className="max-w-md text-lg text-[#d3c4b9]">Исследуйте пересечение структурной жёсткости и атмосферного тепла.</p>
        </div>
        <DarkControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} accentClass="bg-[#e8be9f] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#442b14]" />
      </header>

      {groupMode === "all" ? (
        <div className="columns-1 gap-16 md:columns-2 xl:columns-3">
          {visibleArtworks.map((artwork, index) => (
            <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative mb-16 block break-inside-avoid">
              <div className="absolute inset-0 -z-10 bg-[#8c6a4f]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative overflow-hidden bg-[#191b22]">
                <div className={`relative w-full ${index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-[4/4.4]" : "aspect-[4/6]"}`}>
                  <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#11131a] via-transparent to-transparent p-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {artwork.series ? <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#e8be9f]">{artwork.series}</p> : null}
                  <h3 className="text-2xl font-bold uppercase tracking-[-0.05em] text-[#e1e2eb]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {artwork.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.groupKey} className="border-t border-[#4f453d]/20 pt-6">
              <div className="mb-8 flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-[0.18em] text-[#e8be9f]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{group.groupLabel}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#aab6c9]">{group.itemCount} работ</p>
                </div>
                <button className="text-xs uppercase tracking-[0.2em] text-[#e8be9f]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  {group.collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </div>
              {!group.collapsed ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((artwork) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative block overflow-hidden bg-[#191b22]">
                      <div className="relative aspect-[4/5] w-full">
                        <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold uppercase tracking-[-0.05em] text-[#e1e2eb]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{artwork.title}</h3>
                        <p className="mt-1 text-sm text-[#d3c4b9]">{artwork.medium}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}

      {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
    </section>
  );
}

export function DeepImmersionGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <>
      <section className="px-6 pb-8 pt-8 md:px-12 lg:px-24">
        <DarkControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} accentClass="relative text-[#F1F4F9] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[#1378ec]" />
      </section>
      <section className="px-6 pb-24 md:px-12 lg:px-24">
        {groupMode === "all" ? (
          <div className="mx-auto columns-1 gap-8 md:columns-2 lg:max-w-[1600px] lg:columns-3 lg:gap-16">
            {visibleArtworks.map((artwork) => (
              <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative mb-16 block break-inside-avoid">
                <div className="absolute inset-[-20px] -z-10 rounded-[inherit] bg-[radial-gradient(circle_at_center,_rgba(19,120,236,0.15)_0%,_transparent_70%)] opacity-0 blur-[40px] transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative overflow-hidden bg-[#12151E]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover opacity-90 transition duration-[800ms] group-hover:scale-[1.03] group-hover:opacity-100" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col justify-end bg-gradient-to-t from-[#07090F]/90 to-transparent p-6 opacity-0 transition-opacity duration-[800ms] group-hover:opacity-100">
                    <h2 className="mb-1 text-2xl font-bold tracking-[-0.04em] text-white">{artwork.title}</h2>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-gray-400">{artwork.year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.groupKey} className="border-t border-[#12151E] pt-6">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium uppercase tracking-[0.2em] text-[#1378ec]">{group.groupLabel}</h2>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#5A657A]">{group.itemCount} работ</p>
                  </div>
                  <button className="text-xs uppercase tracking-[0.2em] text-[#F1F4F9]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                    {group.collapsed ? "Развернуть" : "Свернуть"}
                  </button>
                </div>
                {!group.collapsed ? (
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((artwork) => (
                      <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group block overflow-hidden bg-[#12151E]">
                        <div className="relative aspect-[4/5] w-full">
                          <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold tracking-[-0.04em] text-[#F1F4F9]">{artwork.title}</h3>
                          <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#5A657A]">{artwork.year}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
        {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
      </section>
    </>
  );
}

export function EthericPulseGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <section className="mx-auto max-w-screen-2xl px-6 pb-24 pt-8 md:px-12 lg:px-24">
      <div className="mb-16 space-y-6">
        <h1 className="font-[Manrope] text-5xl font-extrabold tracking-[-0.05em] md:text-7xl">Галерея потоков</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[#a7aac0]">Исследуйте визуализацию чистой энергии и безмолвного ритма вселенной.</p>
        <OrganicControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} activeClass="rounded-full bg-[#a894ff] px-6 py-2 text-sm text-[#190055]" idleClass="rounded-full bg-[#1b1f2e] px-6 py-2 text-sm text-[#a7aac0]" />
      </div>
      {groupMode === "all" ? (
        <div className="columns-1 gap-8 md:columns-2 xl:columns-3">
          {visibleArtworks.map((artwork) => (
            <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative mb-8 block break-inside-avoid overflow-hidden rounded-[1.75rem] bg-[#10131d]">
              <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1200} className="h-auto w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c0e17] via-transparent to-transparent p-8 opacity-0 transition duration-500 group-hover:opacity-100">
                <p className="text-xs uppercase tracking-[0.24em] text-[#82d3dc]">{artwork.year}</p>
                <h3 className="mt-2 font-[Manrope] text-2xl font-bold">{artwork.title}</h3>
                <p className="mt-1 text-sm text-[#ffd6d6]/80">{artwork.medium}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.groupKey} className="rounded-[1.75rem] border border-white/5 bg-[rgba(22,25,38,0.42)] p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-[Manrope] text-2xl font-bold text-[#e1e4fb]">{group.groupLabel}</h2>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#82d3dc]">{group.itemCount} работ</p>
                </div>
                <button className="rounded-full bg-[#1b1f2e] px-5 py-2 text-xs uppercase tracking-[0.16em] text-[#a7aac0]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  {group.collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </div>
              {!group.collapsed ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((artwork) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group overflow-hidden rounded-[1.5rem] bg-[#10131d]">
                      <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      <div className="p-5">
                        <h3 className="font-[Manrope] text-xl font-bold text-[#e1e4fb]">{artwork.title}</h3>
                        <p className="mt-1 text-sm text-[#a7aac0]">{artwork.medium}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
      {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
    </section>
  );
}

const mintShapes = [
  "rounded-[50%_50%_44%_56%/42%_58%_46%_54%] aspect-[4/5]",
  "rounded-[48%_52%_58%_42%/42%_58%_46%_54%] aspect-square",
  "rounded-[40%_60%_52%_48%/54%_44%_56%_46%] aspect-[4/5]",
];

export function MintRoseGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-12">
      <div className="mb-12 flex flex-col gap-6">
        <div>
          <p className="text-[32px] italic text-[#4a403a] md:text-[48px]" style={{ fontFamily: "Cormorant Garamond, serif" }}>Exhibition Space</p>
          <p className="text-lg text-[#bcaaa4]" style={{ fontFamily: "Outfit, sans-serif" }}>A collection of organic, fluid abstractions.</p>
        </div>
        <OrganicControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} activeClass="rounded-full bg-[#13ecb6] px-6 py-2 text-sm text-[#10221d]" idleClass="rounded-full border border-[#4a403a]/10 bg-white/40 px-6 py-2 text-sm text-[#4a403a]" />
      </div>
      {groupMode === "all" ? (
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {visibleArtworks.map((artwork, index) => (
            <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className={`group relative isolate mb-8 block break-inside-avoid overflow-hidden bg-transparent shadow-[0_20px_40px_rgba(74,64,58,0.05)] ${mintShapes[index % mintShapes.length]}`}>
              <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="grid min-h-[11rem] w-[72%] max-w-[18rem] place-items-center rounded-[48%_52%_58%_42%/42%_58%_46%_54%] bg-[rgba(19,236,182,0.78)] px-8 py-6 shadow-[0_24px_50px_rgba(19,236,182,0.22)] backdrop-blur-md">
                  <h3 className="text-3xl italic text-white drop-shadow-md" style={{ fontFamily: "Cormorant Garamond, serif" }}>{artwork.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.groupKey} className="rounded-[2rem] bg-[rgba(255,245,245,0.6)] p-6 shadow-[0_20px_40px_rgba(74,64,58,0.05)] backdrop-blur-[20px]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[30px] italic text-[#4a403a]" style={{ fontFamily: "Cormorant Garamond, serif" }}>{group.groupLabel}</h2>
                  <p className="text-sm text-[#bcaaa4]">{group.itemCount} работ</p>
                </div>
                <button className="rounded-full border border-[#4a403a]/10 bg-white/40 px-5 py-2 text-sm text-[#4a403a]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  {group.collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </div>
              {!group.collapsed ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((artwork, index) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className={`group relative block overflow-hidden shadow-[0_20px_40px_rgba(74,64,58,0.05)] ${mintShapes[index % mintShapes.length]}`}>
                      <div className="relative aspect-[4/5] w-full">
                        <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
      {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
    </section>
  );
}

export function OliveCreamGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-12 pb-32 md:px-12 lg:px-24">
      <div className="mb-8">
        <OrganicControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} activeClass="rounded-full bg-[#5ea50d] px-6 py-2 text-base text-[#F2EFE9]" idleClass="rounded-full bg-[#5ea50d]/10 px-6 py-2 text-base text-[#5ea50d]" />
      </div>
      {groupMode === "all" ? (
        <div className="columns-1 gap-10 space-y-10 md:columns-2 lg:columns-3">
          {visibleArtworks.map((artwork) => (
            <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group block break-inside-avoid outline-none">
              <div className="relative overflow-hidden rounded-xl bg-[#E8E3D9] shadow-[0_20px_40px_-10px_rgba(94,165,13,0.12)]">
                <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="mt-5">
                <h3 className="text-2xl font-bold">{artwork.title}</h3>
                <p className="mt-1 text-base italic text-[#9CA38F]">{artwork.medium}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.groupKey} className="rounded-[2rem] bg-[#E8E3D9]/35 p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold italic tracking-tight">{group.groupLabel}</h2>
                  <p className="text-sm text-[#9CA38F]">{group.itemCount} работ</p>
                </div>
                <button className="rounded-full bg-[#F2EFE9] px-5 py-2 text-sm text-[#5ea50d]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  {group.collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </div>
              {!group.collapsed ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((artwork) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group block outline-none">
                      <div className="relative overflow-hidden rounded-xl bg-[#E8E3D9] shadow-[0_20px_40px_-10px_rgba(94,165,13,0.12)]">
                        <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold">{artwork.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
      {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
    </main>
  );
}

export function SageSandGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);
  const shapes = ["rounded-[24px_48px_32px_24px]", "rounded-[48px_24px_24px_40px]", "rounded-[32px_32px_48px_24px]"];

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 lg:px-24">
      <div className="relative mb-10 text-center">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#7D8C74]/15 blur-[20px]" />
        <h1 className="text-5xl font-light italic tracking-wide" style={{ fontFamily: "Cormorant, serif" }}>Collection</h1>
      </div>
      <div className="mb-16 flex justify-center">
        <OrganicControls groupMode={groupMode} setMode={setMode} collapseAll={collapseAll} expandAll={expandAll} activeClass="rounded-full border border-[#7D8C74] bg-[#7D8C74] px-6 py-2 text-sm font-medium text-white" idleClass="rounded-full border border-[#7D8C74] px-6 py-2 text-sm font-medium text-[#7D8C74]" />
      </div>
      {groupMode === "all" ? (
        <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
          {visibleArtworks.map((artwork, index) => (
            <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group mb-8 block break-inside-avoid cursor-pointer">
              <div className={`overflow-hidden bg-[#F4F0E6] p-4 transition duration-500 group-hover:shadow-[0_20px_40px_rgba(43,51,39,0.05)] ${shapes[index % shapes.length]}`}>
                <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="mt-6 px-2">
                  <h3 className="text-xl font-medium">{artwork.title}</h3>
                  <p className="text-sm text-[#A3A89F]">{artwork.medium}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.groupKey} className="rounded-[2rem] bg-[#F4F0E6] p-6 shadow-[0_20px_40px_rgba(43,51,39,0.05)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl italic text-[#2B3327]" style={{ fontFamily: "Cormorant, serif" }}>{group.groupLabel}</h2>
                  <p className="text-sm text-[#A3A89F]">{group.itemCount} работ</p>
                </div>
                <button className="rounded-full border border-[#A3A89F]/30 px-5 py-2 text-sm text-[#7D8C74]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  {group.collapsed ? "Развернуть" : "Свернуть"}
                </button>
              </div>
              {!group.collapsed ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((artwork, index) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group block cursor-pointer">
                      <div className={`overflow-hidden bg-[#F4F0E6] p-4 shadow-[0_20px_40px_rgba(43,51,39,0.05)] ${shapes[index % shapes.length]}`}>
                        <Image src={artwork.imagePreview} alt={artwork.title} width={900} height={1100} className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
      {hasMore ? <div ref={sentinelRef} className="h-16" /> : null}
    </main>
  );
}
