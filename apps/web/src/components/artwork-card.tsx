import Image from "next/image";
import Link from "next/link";

import type { Artwork } from "@/features/artworks/types";
import type { SiteTheme } from "@/features/themes/types";
import { artworkMeta, statusLabel } from "@/shared/format";

type ArtworkCardProps = {
  artwork: Artwork;
  theme: SiteTheme;
  showStatus?: boolean;
};

export function ArtworkCard({ artwork, theme, showStatus = false }: ArtworkCardProps) {
  return (
    <article className={`overflow-hidden rounded-[2rem] ${theme.cardClassName}`}>
      <Link href={`/artwork/${artwork.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={artwork.imagePreview}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{artwork.title}</h3>
            <p className={`text-sm ${theme.subtleClassName}`}>{artworkMeta(artwork)}</p>
          </div>
          {showStatus ? (
            <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.15em] ${theme.accentClassName}`}>
              {statusLabel(artwork.status)}
            </span>
          ) : null}
        </div>
        <p className={`line-clamp-3 text-sm ${theme.subtleClassName}`}>{artwork.description}</p>
      </div>
    </article>
  );
}
