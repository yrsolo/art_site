import { NextResponse } from "next/server";

import { reorderArtworks } from "@/server/artwork-repository";
import { badRequest, unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as { ids?: string[] };

  if (!Array.isArray(body.ids)) {
    return badRequest("ids array is required.");
  }

  const artworks = await reorderArtworks(body.ids);
  return NextResponse.json({ artworks });
}
