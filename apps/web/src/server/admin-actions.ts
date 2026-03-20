"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseArtworkInput } from "@/features/artworks/form-data";
import { clearSession, createSession, getSession, validateAdminCredentials } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";
import { getAssetStorage } from "@/server/storage";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }

  await createSession(username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function createArtworkAction(formData: FormData) {
  if (!(await getSession())) {
    redirect("/admin/login");
  }

  const repository = getArtworkRepository();
  const input = parseArtworkInput(formData);
  await repository.create(input);
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}

export async function updateArtworkAction(formData: FormData) {
  if (!(await getSession())) {
    redirect("/admin/login");
  }

  const repository = getArtworkRepository();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Artwork id is required.");
  }

  const input = parseArtworkInput(formData);
  await repository.update(id, input);

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath(`/artwork/${input.slug}`);
  revalidatePath("/admin");
}

export async function deleteArtworkAction(formData: FormData) {
  if (!(await getSession())) {
    redirect("/admin/login");
  }

  const repository = getArtworkRepository();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Artwork id is required.");
  }

  const artwork = await repository.getById(id);

  if (artwork?.imageOriginal.startsWith("/uploads/")) {
    await getAssetStorage().remove(artwork.imageOriginal.replace("/uploads/", ""));
  }

  await repository.delete(id);

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin");
}
