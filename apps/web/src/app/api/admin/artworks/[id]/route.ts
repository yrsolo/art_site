import { NextResponse } from "next/server";

import { parseArtworkInput } from "@/features/artworks/form-data";
import { getSession } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";

type ArtworkRouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: ArtworkRouteProps) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const formData = new FormData();

  Object.entries(body as Record<string, string>).forEach(([key, value]) => {
    formData.set(key, value);
  });

  const artwork = await getArtworkRepository().update(id, parseArtworkInput(formData));
  return NextResponse.json({ artwork });
}

export async function DELETE(_request: Request, { params }: ArtworkRouteProps) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  await getArtworkRepository().delete(id);
  return NextResponse.json({ ok: true });
}
