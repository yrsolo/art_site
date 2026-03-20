import { NextResponse } from "next/server";

import { getSession } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";
import { getAssetStorage } from "@/server/storage";

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const artworkId = String(formData.get("artworkId") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const uploaded = await getAssetStorage().upload(file);

  if (artworkId) {
    const repository = getArtworkRepository();
    const artwork = await repository.getById(artworkId);

    if (artwork) {
      await repository.update(artwork.id, {
        ...artwork,
        imageOriginal: uploaded.url,
        imagePreview: uploaded.url,
      });
    }
  }

  const acceptsJson = request.headers.get("accept")?.includes("application/json");

  if (acceptsJson) {
    return NextResponse.json(uploaded);
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}
