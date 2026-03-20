import { NextResponse } from "next/server";

import { getArtworkRepository } from "@/server/repository";

type ArtworkPublicRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: ArtworkPublicRouteProps) {
  const { slug } = await params;
  const artwork = await getArtworkRepository().getBySlug(slug);

  if (!artwork || artwork.status === "hidden") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ artwork });
}
