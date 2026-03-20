type AdminUploadFormProps = {
  artworkId?: string;
};

export function AdminUploadForm({ artworkId }: AdminUploadFormProps) {
  return (
    <form
      action="/api/admin/upload"
      method="post"
      encType="multipart/form-data"
      className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 space-y-1">
        <h3 className="text-lg font-semibold">Upload local image</h3>
        <p className="text-sm text-black/60">
          Uploads are saved into the local `public/uploads` folder for this MVP.
        </p>
      </div>
      {artworkId ? <input type="hidden" name="artworkId" value={artworkId} /> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <input
          type="file"
          name="file"
          accept="image/*"
          className="block w-full rounded-2xl border border-dashed border-black/20 px-4 py-4 text-sm"
          required
        />
        <button type="submit" className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90">
          Upload image
        </button>
      </div>
    </form>
  );
}
