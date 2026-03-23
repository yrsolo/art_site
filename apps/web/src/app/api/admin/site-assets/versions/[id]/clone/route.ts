import { cloneSiteAssetVersion } from "@/server/site-asset-repository";
import { badRequest, created, unauthorized } from "@/server/http";
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
    const version = await cloneSiteAssetVersion(String(body.variantId ?? ""), parseSiteAssetSlotKey(body.slotKey), id);
    return created({ version });
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Failed to clone site asset version.");
  }
}
