"use client";

import Image from "next/image";
import Link from "next/link";

import { useGalleryBrowser } from "@/components/public/gallery-browser";
import type { Artwork } from "@/features/artworks/types";

export function ColdMistGalleryClient({ variantId, artworks }: { variantId: string; artworks: Artwork[] }) {
  const { artworks: visibleArtworks, collapseAll, expandAll, groupMode, groups, hasMore, sentinelRef, setMode, toggleGroup } = useGalleryBrowser(artworks);

  return (
    <>
      <section className="mb-16 mx-auto max-w-7xl px-6 md:px-12 pt-10 md:pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.05em] text-[#d9e6fd] mb-4">ARCHIVE.</h1>
            <p className="text-[#9facc1] text-lg tracking-tight font-light leading-relaxed">
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
                className={groupMode === value ? "text-[#bfc7cf] font-medium tracking-tighter text-sm uppercase" : "text-[#9facc1] font-medium tracking-tighter text-sm uppercase"}
                type="button"
                onClick={() => setMode(value as "all" | "year" | "series")}
              >
                {label}
              </button>
            ))}
            {groupMode !== "all" ? (
              <>
                <span className="mx-1 h-4 w-px bg-[#3c495b]/40" />
                <button className="text-[#9facc1] text-xs uppercase tracking-[0.14em]" type="button" onClick={collapseAll}>
                  Свернуть все
                </button>
                <button className="text-[#9facc1] text-xs uppercase tracking-[0.14em]" type="button" onClick={expandAll}>
                  Развернуть все
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {groupMode === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {[0, 1, 2].map((columnIndex) => {
              const columnItems = visibleArtworks.filter((_, index) => index % 3 === columnIndex);
              return (
                <div key={`column-${columnIndex}`} className={`flex flex-col gap-12 ${columnIndex === 1 ? "md:mt-24" : ""}`}>
                  {columnItems.map((artwork) => (
                    <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative">
                      <div className="absolute inset-0 mist-gradient -z-10 scale-150 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="bg-[#121a25] overflow-hidden">
                        <div className="relative aspect-[4/5] w-full">
                          <Image
                            src={artwork.imagePreview}
                            alt={artwork.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-crosshair"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold tracking-tighter uppercase text-[#d9e6fd]">{artwork.title}</h3>
                          <p className="text-[10px] text-[#9facc1] uppercase tracking-[0.1em]">
                            {artwork.year} • {artwork.medium}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[#6a768a] text-sm">north_east</span>
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
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-[#9facc1]">{group.groupLabel}</p>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6a768a]">{group.itemCount} работ</p>
                  </div>
                  <button className="text-[#bfc7cf] text-xs uppercase tracking-[0.18em]" type="button" onClick={() => toggleGroup(group.groupKey)}>
                    {group.collapsed ? "Развернуть" : "Свернуть"}
                  </button>
                </div>
                {!group.collapsed ? (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {group.items.map((artwork) => (
                      <Link key={artwork.id} href={`/${variantId}/artwork/${artwork.slug}`} className="group relative">
                        <div className="bg-[#121a25] overflow-hidden">
                          <div className="relative aspect-[4/5] w-full">
                            <Image src={artwork.imagePreview} alt={artwork.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover grayscale transition duration-700 group-hover:grayscale-0" />
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-sm font-bold tracking-tighter uppercase text-[#d9e6fd]">{artwork.title}</h3>
                          <p className="text-[10px] text-[#9facc1] uppercase tracking-[0.1em]">{artwork.medium}</p>
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

      <section className="mt-48 mb-32 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 px-6 md:px-12">
        <div className="md:w-1/2">
          <div className="w-full h-px bg-[#3c495b]/30 mb-8" />
          <h2 className="text-3xl font-bold tracking-tighter text-[#d9e6fd] uppercase mb-6">Соберите свой взгляд.</h2>
          <p className="text-[#9facc1] max-w-sm">Каждая работа в этой галерее является частью более крупной экосистемы тишины. Используйте кураторский инструмент, чтобы собрать собственный туманный архив.</p>
          <Link href={`/${variantId}/contacts`} className="mt-8 inline-flex px-8 py-4 bg-[#bfc7cf] text-[#394148] font-bold tracking-tighter uppercase text-xs hover:bg-[#cdd5dd] transition-colors">
            Запросить работу
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <div className="w-64 h-64 bg-[#16202e] relative overflow-hidden group">
            <div className="absolute inset-0 mist-gradient opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#bfc7cf]/20 text-7xl">blur_on</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
