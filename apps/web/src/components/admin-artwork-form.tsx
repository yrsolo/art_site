import { createArtworkAction, deleteArtworkAction, updateArtworkAction } from "@/server/admin-actions";
import type { Artwork } from "@/features/artworks/types";

type AdminArtworkFormProps = {
  artwork?: Artwork;
};

const statusOptions = ["available", "sold", "hidden"] as const;

export function AdminArtworkForm({ artwork }: AdminArtworkFormProps) {
  const action = artwork ? updateArtworkAction : createArtworkAction;

  return (
    <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{artwork ? "Edit artwork" : "Create artwork"}</h3>
          <p className="text-sm text-black/60">
            {artwork ? "Update metadata, status, order, and local image URL." : "Add a new artwork to the local JSON repository."}
          </p>
        </div>
        {artwork ? (
          <form action={deleteArtworkAction}>
            <input type="hidden" name="id" value={artwork.id} />
            <button type="submit" className="rounded-full border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
              Delete
            </button>
          </form>
        ) : null}
      </div>

      <form action={action} className="grid gap-4 md:grid-cols-2">
        {artwork ? <input type="hidden" name="id" value={artwork.id} /> : null}
        <label className="space-y-2 text-sm">
          <span>Title</span>
          <input name="title" defaultValue={artwork?.title} className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Slug</span>
          <input name="slug" defaultValue={artwork?.slug} className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>Description</span>
          <textarea
            name="description"
            defaultValue={artwork?.description}
            className="min-h-32 w-full rounded-2xl border border-black/10 px-4 py-3"
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Year</span>
          <input name="year" defaultValue={artwork?.year} className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Size</span>
          <input name="size" defaultValue={artwork?.size} className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Medium</span>
          <input name="medium" defaultValue={artwork?.medium} className="w-full rounded-2xl border border-black/10 px-4 py-3" required />
        </label>
        <label className="space-y-2 text-sm">
          <span>Status</span>
          <select name="status" defaultValue={artwork?.status ?? "available"} className="w-full rounded-2xl border border-black/10 px-4 py-3">
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span>Order</span>
          <input
            type="number"
            min="1"
            name="order"
            defaultValue={artwork?.order ?? 1}
            className="w-full rounded-2xl border border-black/10 px-4 py-3"
            required
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Original image URL</span>
          <input
            name="imageOriginal"
            defaultValue={artwork?.imageOriginal}
            className="w-full rounded-2xl border border-black/10 px-4 py-3"
            required
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span>Preview image URL</span>
          <input
            name="imagePreview"
            defaultValue={artwork?.imagePreview ?? artwork?.imageOriginal}
            className="w-full rounded-2xl border border-black/10 px-4 py-3"
            required
          />
        </label>
        <div className="flex justify-end md:col-span-2">
          <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90">
            {artwork ? "Save changes" : "Create artwork"}
          </button>
        </div>
      </form>
    </div>
  );
}
