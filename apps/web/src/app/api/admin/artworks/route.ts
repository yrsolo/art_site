import { NextResponse } from "next/server";

import { createArtwork, listArtworkSummaries } from "@/server/artwork-repository";
import { exportPublicSiteSnapshot } from "@/server/export-service";
import { badRequest, created, unauthorized } from "@/server/http";
import { parseArtworkInput } from "@/server/parsers";
import { requireSession } from "@/server/session";

export async function GET() {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const artworks = await listArtworkSummaries();
  return NextResponse.json({ artworks });
}

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  try {
    const artwork = await createArtwork(parseArtworkInput((await request.json()) as Record<string, unknown>));
    await exportPublicSiteSnapshot();
    return created({ artwork });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to create artwork.");
  }
}
