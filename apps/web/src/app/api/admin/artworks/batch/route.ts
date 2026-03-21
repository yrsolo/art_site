import { NextResponse } from "next/server";

import { applyBulkArtworkAction } from "@/server/artwork-repository";
import { exportPublicSiteSnapshot } from "@/server/export-service";
import { badRequest, unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

const validActions = new Set(["delete", "archive", "unarchive"]);

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as {
    ids?: string[];
    action?: string;
  };

  if (!Array.isArray(body.ids)) {
    return badRequest("ids array is required.");
  }

  if (!body.action || !validActions.has(body.action)) {
    return badRequest("Valid batch action is required.");
  }

  const artworks = await applyBulkArtworkAction(body.ids, body.action as "delete" | "archive" | "unarchive");
  await exportPublicSiteSnapshot();
  return NextResponse.json({ artworks });
}
