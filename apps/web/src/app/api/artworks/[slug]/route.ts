import { NextResponse } from "next/server";

import { getArtworkBySlug } from "@/server/artwork-repository";
import { notFound } from "@/server/http";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork || artwork.isArchived || !artwork.showInGallery) {
    return notFound("Artwork not found.");
  }

  return NextResponse.json({ artwork });
}
