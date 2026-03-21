import { NextResponse } from "next/server";

import { deleteArtwork, getArtworkById, updateArtwork } from "@/server/artwork-repository";
import { badRequest, notFound, unauthorized } from "@/server/http";
import { parseArtworkInput } from "@/server/parsers";
import { requireSession } from "@/server/session";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const artwork = await getArtworkById(id);
  return artwork ? NextResponse.json({ artwork }) : notFound("Artwork not found.");
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;

  try {
    const artwork = await updateArtwork(id, parseArtworkInput((await request.json()) as Record<string, unknown>));
    return NextResponse.json({ artwork });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to update artwork.");
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;

  try {
    const artwork = await deleteArtwork(id);
    return NextResponse.json({ artwork });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to delete artwork.");
  }
}
