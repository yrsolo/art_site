import { NextResponse } from "next/server";

import { addArtworkPhoto, getArtworkById } from "@/server/artwork-repository";
import { exportPublicSiteSnapshot } from "@/server/export-service";
import { badRequest, notFound, unauthorized } from "@/server/http";
import { uploadArtworkImage } from "@/server/media-service";
import { requireSession } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const artwork = await getArtworkById(id);

  if (!artwork) {
    return notFound("Artwork not found.");
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return badRequest("file is required.");
  }

  const { photo } = await uploadArtworkImage(file, id);
  const updated = await addArtworkPhoto(id, photo);
  await exportPublicSiteSnapshot();
  return NextResponse.json({ artwork: updated, photo }, { status: 201 });
}
