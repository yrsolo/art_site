import { NextResponse } from "next/server";

import { buildPublicSiteSnapshot } from "@/server/export-service";

export async function GET() {
  const snapshot = await buildPublicSiteSnapshot();
  return NextResponse.json({ snapshot });
}
