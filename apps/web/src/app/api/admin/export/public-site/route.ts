import { NextResponse } from "next/server";

import { exportPublicSiteSnapshot } from "@/server/export-service";
import { unauthorized } from "@/server/http";
import { requireSession } from "@/server/session";

export async function POST() {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const result = await exportPublicSiteSnapshot();
  return NextResponse.json({ key: result.key, generatedAt: result.snapshot.generatedAt });
}
