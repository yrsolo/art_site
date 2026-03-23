"use client";

import Image from "next/image";
import Link from "@/components/public/showcase-link";

import type { Artwork } from "@/features/artworks/types";
import type { VariantManifest } from "@/features/variants/types";
import { artworkMeta, statusLabel } from "@/shared/format";

type VariantArtworkCardProps = {
  variant: VariantManifest;
  artwork: Artwork;
  showStatus?: boolean;
};

export function VariantArtworkCard({ variant, artwork, showStatus = false }: VariantArtworkCardProps) {
  return (
    <article className={`overflow-hidden ${variant.classes.card} ${variant.classes.pill}`}>
      <Link href={`/${variant.id}/artwork/${artwork.slug}`} className="block">
        <div className={`relative aspect-[4/3] w-full overflow-hidden ${variant.classes.artworkFrame}`}>
          <Image
            src={artwork.imagePreview}
            alt={artwork.title}
            fill
            className="object-cover transition duration-500 hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">{artwork.title}</h3>
            <p className={`text-sm ${variant.classes.subtle}`}>{artworkMeta(artwork)}</p>
          </div>
          {showStatus ? (
            <span className={`px-3 py-1 text-xs uppercase tracking-[0.15em] ${variant.classes.accent} ${variant.classes.pill}`}>
              {statusLabel(artwork.status)}
            </span>
          ) : null}
        </div>
        <p className={`text-sm leading-7 ${variant.classes.subtle}`}>{artwork.description}</p>
      </div>
    </article>
  );
}
