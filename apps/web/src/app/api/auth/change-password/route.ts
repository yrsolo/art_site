import { NextResponse } from "next/server";

import { requireSession, updateAdminPassword } from "@/server/auth";
import { badRequest, unauthorized } from "@/server/http";

export async function POST(request: Request) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  const body = (await request.json()) as { nextPassword?: string };
  const nextPassword = String(body.nextPassword ?? "");

  if (nextPassword.length < 3) {
    return badRequest("Password must be at least 3 characters long.");
  }

  await updateAdminPassword(nextPassword);
  return NextResponse.json({ ok: true });
}
