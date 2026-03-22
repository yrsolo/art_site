import { NextResponse } from "next/server";

import { createSiteAssetVersion, listSiteAssetVersions } from "@/server/site-asset-repository";
import { badRequest, created, unauthorized } from "@/server/http";
import { parseSiteAssetSlotKey } from "@/server/parsers";
import { requireSession } from "@/server/session";

function parsePayload(payload: Record<string, unknown> | undefined) {
  return {
    assetId: String(payload?.assetId ?? ""),
    url: String(payload?.url ?? ""),
    alt: String(payload?.alt ?? ""),
    caption: String(payload?.caption ?? ""),
    focalPoint:
      typeof payload?.focalPoint === "object" && payload?.focalPoint !== null
        ? {
            x: Number((payload.focalPoint as { x?: unknown }).x ?? 0.5),
            y: Number((payload.focalPoint as { y?: unknown }).y ?? 0.5),
          }
        : null,
    decorative: Boolean(payload?.decorative),
    variantOverrides:
      typeof payload?.variantOverrides === "object" && payload?.variantOverrides !== null
        ? (payload.variantOverrides as Record<string, string>)
        : undefined,
  };
}

export async function GET(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId") ?? "";

  try {
    const slotKey = parseSiteAssetSlotKey(searchParams.get("slotKey"));
    const versions = await listSiteAssetVersions(variantId, slotKey);
    return NextResponse.json({ versions });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to read site asset versions.");
  }
}

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as {
    variantId?: string;
    slotKey?: string;
    versionName?: string;
    payload?: Record<string, unknown>;
  };

  try {
    const version = await createSiteAssetVersion(
      String(body.variantId ?? ""),
      parseSiteAssetSlotKey(body.slotKey),
      String(body.versionName ?? "Черновик"),
      parsePayload(body.payload),
    );
    return created({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to create site asset version.");
  }
}
