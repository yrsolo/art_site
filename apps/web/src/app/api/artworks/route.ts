import { NextResponse } from "next/server";

import { getArtworkRepository } from "@/server/repository";

export async function GET() {
  const artworks = await getArtworkRepository().listPublic();
  return NextResponse.json({ artworks });
}
