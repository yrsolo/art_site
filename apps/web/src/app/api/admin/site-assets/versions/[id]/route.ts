import { NextResponse } from "next/server";

import { getSiteAssetVersion, updateSiteAssetVersion } from "@/server/site-asset-repository";
import { badRequest, notFound, unauthorized } from "@/server/http";
import { parseSiteAssetSlotKey, parseSiteAssetStatus } from "@/server/parsers";
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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId") ?? "";

  try {
    const slotKey = parseSiteAssetSlotKey(searchParams.get("slotKey"));
    const version = await getSiteAssetVersion(variantId, slotKey, id);
    return version ? NextResponse.json({ version }) : notFound("Site asset version not found.");
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to load site asset version.");
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    variantId?: string;
    slotKey?: string;
    versionName?: string;
    payload?: Record<string, unknown>;
    status?: string;
  };

  try {
    const slotKey = parseSiteAssetSlotKey(body.slotKey);
    const version = await updateSiteAssetVersion(String(body.variantId ?? ""), slotKey, id, {
      versionName: String(body.versionName ?? "Черновик"),
      payload: parsePayload(body.payload),
      status: parseSiteAssetStatus(body.status),
    });
    return NextResponse.json({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to update site asset version.");
  }
}
