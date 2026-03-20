import { NextResponse } from "next/server";

import { getSession } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { idsInOrder?: string[] };
  const idsInOrder = Array.isArray(body.idsInOrder) ? body.idsInOrder : [];
  const artworks = await getArtworkRepository().reorder(idsInOrder);
  return NextResponse.json({ artworks });
}
