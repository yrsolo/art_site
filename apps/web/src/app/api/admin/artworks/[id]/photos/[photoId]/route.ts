import { NextResponse } from "next/server";

import { removeArtworkPhoto, updateArtworkPhotoMetadata } from "@/server/artwork-repository";
import { unauthorized } from "@/server/http";
import { removeArtworkImage } from "@/server/media-service";
import { requireSession } from "@/server/session";

export async function PATCH(request: Request, context: { params: Promise<{ id: string; photoId: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id, photoId } = await context.params;
  const body = (await request.json()) as { alt?: string; caption?: string };
  const artwork = await updateArtworkPhotoMetadata(id, photoId, {
    alt: typeof body.alt === "string" ? body.alt : undefined,
    caption: typeof body.caption === "string" ? body.caption : undefined,
  });

  return NextResponse.json({ artwork });
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string; photoId: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id, photoId } = await context.params;
  const result = await removeArtworkPhoto(id, photoId);

  if (result.removed) {
    await removeArtworkImage(result.removed.storageKey, result.removed.previewStorageKey);
  }

  return NextResponse.json({ artwork: result.artwork });
}
