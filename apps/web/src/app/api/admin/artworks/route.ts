import { NextResponse } from "next/server";

import { parseArtworkInput } from "@/features/artworks/form-data";
import { getSession } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const artworks = await getArtworkRepository().listAll();
  return NextResponse.json({ artworks });
}

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const formData = new FormData();

  Object.entries(body as Record<string, string>).forEach(([key, value]) => {
    formData.set(key, value);
  });

  const artwork = await getArtworkRepository().create(parseArtworkInput(formData));
  return NextResponse.json({ artwork }, { status: 201 });
}
