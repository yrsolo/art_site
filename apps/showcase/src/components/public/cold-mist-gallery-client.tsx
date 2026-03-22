"use client";

import Image from "next/image";
import Link from "@/components/public/showcase-link";

import { useGalleryBrowser } from "@/components/public/gallery-browser";
import type { Artwork } from "@/features/artworks/types";

export function ColdMistGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <>
      <section className="mb-16 mx-auto max-w-7xl px-6 pt-10 md:px-12 md:pt-20">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold tracking-[-0.05em] text-[#d9e6fd] md:text-7xl">ARCHIVE.</h1>
            <p className="text-lg font-light leading-relaxed tracking-tight text-[#9facc1]">
              Кураторская коллекция эфемерных пустот и архитектурной тишины. Исследование пересечения холодного сланца и
              туманного утреннего света.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-b border-[#3c495b]/30 pb-2">
            {[
              ["all", "Все"],
              ["year", "По году"],
              ["series", "По серии"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={groupMode === value ? "text-[#bfc7cf] text-sm font-medium uppercase tracking-tighter" : "text-[#9facc1] text-sm font-medium uppercase tracking-tighter"}
                type="button"
                onClick={() => setMode(value as "all" | "year" | "series")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-12">
        {groupMode === "all" ? (
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3">
            {[0, 1, 2].map((columnIndex) => {
              const columnItems = visibleArtworks.filter((_, index) => index % 3 === columnIndex);
              return (
                <div key={`column-${columnIndex}`} className={`flex flex-col gap-12 ${columnIndex === 1 ? "md:mt-24" : ""}`}>
                  {columnItems.map((artwork) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative">
                      <div className="mist-gradient absolute inset-0 -z-10 scale-150 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                      <div className="overflow-hidden bg-[#121a25]">
                        <div className="relative aspect-[4/5] w-full">
                          <Image
                            src={artwork.imagePreview}
                            alt={artwork.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="h-full w-full cursor-crosshair object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-tighter text-[#d9e6fd]">{artwork.title}</h3>
                          <p className="text-[10px] uppercase tracking-[0.1em] text-[#9facc1]">
                            {artwork.year} • {artwork.medium}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-sm text-[#6a768a]">north_east</span>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.groupKey} className="border-t border-[#3c495b]/20 pt-6">
                <button className="mb-6 flex w-full items-center justify-between gap-4 text-left" type="button" onClick={() => toggleGroup(group.groupKey)}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#9facc1]">{group.groupLabel}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6a768a]">{group.itemCount} работ</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-[#bfc7cf]">{group.collapsed ? "Развернуть" : "Свернуть"}</span>
                </button>
                {!group.collapsed ? (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {group.items.map((artwork) => (
                      <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative">
                        <div className="overflow-hidden bg-[#121a25]">
                          <div className="relative aspect-[4/5] w-full">
                            <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover grayscale transition duration-700 group-hover:grayscale-0" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-sm font-bold uppercase tracking-tighter text-[#d9e6fd]">{artwork.title}</h3>
                          <p className="text-[10px] uppercase tracking-[0.1em] text-[#9facc1]">{artwork.medium}</p>
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

      <section className="mx-auto mb-32 mt-48 flex max-w-7xl flex-col gap-12 px-6 md:flex-row md:px-12">
        <div className="md:w-1/2">
          <div className="mb-8 h-px w-full bg-[#3c495b]/30" />
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-tighter text-[#d9e6fd]">Соберите свой взгляд.</h2>
          <p className="max-w-sm text-[#9facc1]">Каждая работа в этой галерее является частью более крупной экосистемы тишины. Используйте кураторский инструмент, чтобы собрать собственный туманный архив.</p>
          <Link href={`/${variantId}/contacts`} className="mt-8 inline-flex bg-[#bfc7cf] px-8 py-4 text-xs font-bold uppercase tracking-tighter text-[#394148] transition-colors hover:bg-[#cdd5dd]">
            Запросить работу
          </Link>
        </div>
        <div className="flex justify-end md:w-1/2">
          <div className="relative h-64 w-64 overflow-hidden bg-[#16202e] group">
            <div className="mist-gradient absolute inset-0 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-7xl text-[#bfc7cf]/20">blur_on</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
