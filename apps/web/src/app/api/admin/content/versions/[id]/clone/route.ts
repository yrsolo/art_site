import { NextResponse } from "next/server";

import { cloneContentVersion } from "@/server/content-repository";
import { badRequest, created, unauthorized } from "@/server/http";
import { parseContentPageKey } from "@/server/parsers";
import { requireSession } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = (await request.json()) as { variantId?: string; pageKey?: string };

  try {
    const version = await cloneContentVersion(String(body.variantId ?? ""), parseContentPageKey(body.pageKey), id);
    return created({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to clone content version.");
  }
}
