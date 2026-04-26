import { NextResponse } from "next/server";

import type { ContentPageKey, ContentVersion } from "@/features/content/types";
import { exportPublicSiteSnapshot } from "@/server/export-service";
import { publishContentPreset } from "@/server/content-repository";
import { badRequest, unauthorized } from "@/server/http";
import { parseContentPageKey } from "@/server/parsers";
import { requireSession } from "@/server/session";

type PresetPublishPageInput = {
  id?: string;
  payload?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as {
    variantId?: string;
    versionName?: string;
    pages?: Record<string, PresetPublishPageInput>;
  };

  try {
    const pages: Partial<Record<ContentPageKey, { id?: string; payload: ContentVersion["payload"] }>> = {};

    for (const [rawPageKey, page] of Object.entries(body.pages ?? {})) {
      const pageKey = parseContentPageKey(rawPageKey);
      pages[pageKey] = {
        id: page.id ? String(page.id) : undefined,
        payload: (page.payload ?? {}) as ContentVersion["payload"],
      };
    }

    const result = await publishContentPreset(String(body.variantId ?? ""), String(body.versionName ?? "Черновик"), pages);
    const exportResult = await exportPublicSiteSnapshot();

    return NextResponse.json({
      publication: result.publication,
      versions: result.versions,
      export: {
        key: exportResult.key,
        revision: exportResult.snapshot.revision,
        publishedAt: exportResult.snapshot.publishedAt,
      },
    });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to publish content preset.");
  }
}
