import { NextResponse } from "next/server";

import { exportPublicSiteSnapshot } from "@/server/export-service";
import { publishContentVersion } from "@/server/content-repository";
import { badRequest, unauthorized } from "@/server/http";
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
    const publication = await publishContentVersion(String(body.variantId ?? ""), parseContentPageKey(body.pageKey), id);
    await exportPublicSiteSnapshot();
    return NextResponse.json({ publication });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to publish content version.");
  }
}
