import { redirect } from "next/navigation";

import { AdminArtworkForm } from "@/components/admin-artwork-form";
import { AdminUploadForm } from "@/components/admin-upload-form";
import { logoutAction } from "@/server/admin-actions";
import { getSession } from "@/server/auth";
import { getArtworkRepository } from "@/server/repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const artworks = await getArtworkRepository().listAll();

  return (
    <main className="min-h-screen bg-[#f5f1ea] px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/60">Admin</p>
            <h1 className="mt-3 text-4xl font-semibold">Local studio control panel</h1>
            <p className="mt-3 max-w-2xl text-sm text-black/60">
              Manage artworks stored in the local JSON repository, adjust order and status, and upload images to the
              local `public/uploads` directory.
            </p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium hover:bg-black/5">
              Logout
            </button>
          </form>
        </header>

        <section className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="space-y-6">
            <AdminUploadForm />
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-black/60">Current order</p>
              <ol className="mt-4 space-y-3">
                {artworks.map((artwork) => (
                  <li key={artwork.id} className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-3">
                    <span className="font-medium">{artwork.title}</span>
                    <span className="text-sm text-black/60">#{artwork.order}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-6">
            <AdminArtworkForm />
            {artworks.map((artwork) => (
              <AdminArtworkForm key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
