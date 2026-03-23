import { NextResponse } from "next/server";

import { reorderArtworkPhotos } from "@/server/artwork-repository";
import { badRequest, unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = (await request.json()) as { photoIds?: string[] };

  if (!Array.isArray(body.photoIds)) {
    return badRequest("photoIds array is required.");
  }

  const artwork = await reorderArtworkPhotos(id, body.photoIds);
  return NextResponse.json({ artwork });
}
