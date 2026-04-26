import { NextResponse } from "next/server";

import { deleteContentPreset } from "@/server/content-repository";
import { badRequest, unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as {
    variantId?: string;
    versionName?: string;
  };

  try {
    const result = await deleteContentPreset(String(body.variantId ?? ""), String(body.versionName ?? ""));
    return NextResponse.json(result);
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to delete content preset.");
  }
}
