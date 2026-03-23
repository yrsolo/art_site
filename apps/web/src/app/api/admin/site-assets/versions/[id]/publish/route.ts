import { NextResponse } from "next/server";

import { exportPublicSiteSnapshot } from "@/server/export-service";
import { publishSiteAssetVersion } from "@/server/site-asset-repository";
import { badRequest, unauthorized } from "@/server/http";
import { parseSiteAssetSlotKey } from "@/server/parsers";
import { requireSession } from "@/server/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = (await request.json()) as { variantId?: string; slotKey?: string };

  try {
    const publication = await publishSiteAssetVersion(String(body.variantId ?? ""), parseSiteAssetSlotKey(body.slotKey), id);
    await exportPublicSiteSnapshot();
    return NextResponse.json({ publication });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to publish site asset version.");
  }
}
