import { NextResponse } from "next/server";

import { unauthorized } from "@/server/http";
import { importSketchArtworkSeeds } from "@/server/sketch-artwork-import";
import { requireSession } from "@/server/session";

export async function POST() {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const result = await importSketchArtworkSeeds();
  return NextResponse.json(result);
}
