import { NextResponse } from "next/server";

import { listPublicArtworks } from "@/server/artwork-repository";

export async function GET() {
  const artworks = await listPublicArtworks();
  return NextResponse.json({ artworks });
}
