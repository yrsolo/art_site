import { NextResponse } from "next/server";

import { exportPublicSiteSnapshot } from "@/server/export-service";
import { setPrimaryArtworkPhoto } from "@/server/artwork-repository";
import { unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function POST(_: Request, context: { params: Promise<{ id: string; photoId: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id, photoId } = await context.params;
  const artwork = await setPrimaryArtworkPhoto(id, photoId);
  await exportPublicSiteSnapshot();
  return NextResponse.json({ artwork });
}
