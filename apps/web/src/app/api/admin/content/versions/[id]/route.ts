import { NextResponse } from "next/server";

import { getContentVersion, updateContentVersion } from "@/server/content-repository";
import { badRequest, notFound, unauthorized } from "@/server/http";
import { parseContentPageKey, parseContentStatus } from "@/server/parsers";
import { requireSession } from "@/server/session";

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
    const pageKey = parseContentPageKey(searchParams.get("pageKey"));
    const version = await getContentVersion(variantId, pageKey, id);
    return version ? NextResponse.json({ version }) : notFound("Content version not found.");
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to load content version.");
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
    pageKey?: string;
    versionName?: string;
    payload?: Record<string, unknown>;
    status?: string;
  };

  try {
    const pageKey = parseContentPageKey(body.pageKey);
    const version = await updateContentVersion(String(body.variantId ?? ""), pageKey, id, {
      versionName: String(body.versionName ?? "Черновик"),
      payload: (body.payload ?? {}) as never,
      status: parseContentStatus(body.status),
    });
    return NextResponse.json({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to update content version.");
  }
}
