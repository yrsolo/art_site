import { NextResponse } from "next/server";

import { createContentVersion, listContentVersions } from "@/server/content-repository";
import { badRequest, created, unauthorized } from "@/server/http";
import { parseContentPageKey } from "@/server/parsers";
import { requireSession } from "@/server/session";

export async function GET(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId") ?? "";

  try {
    const pageKey = parseContentPageKey(searchParams.get("pageKey"));
    const versions = await listContentVersions(variantId, pageKey);
    return NextResponse.json({ versions });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to read versions.");
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
    pageKey?: string;
    versionName?: string;
    payload?: Record<string, unknown>;
  };

  try {
    const version = await createContentVersion(
      String(body.variantId ?? ""),
      parseContentPageKey(body.pageKey),
      String(body.versionName ?? "Черновик"),
      (body.payload ?? {}) as never,
    );
    return created({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to create content version.");
  }
}
