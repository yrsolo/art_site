import { VariantCatalogCard } from "@/components/public/variant-catalog-card";
import { listVariants } from "@/features/variants";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const variants = listVariants();

  return (
    <main className="min-h-screen bg-[#f5f1ea] text-[#1f1e1b]">
      <section className="border-b border-black/10 bg-[radial-gradient(circle_at_top_right,_rgba(140,106,79,0.12),_transparent_32%),linear-gradient(135deg,_#f6f0e8,_#f3ece3_58%,_#ebe3d5)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-18 md:py-24">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] opacity-70">Variant catalog</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-none md:text-7xl">
              Six independent front faces over one shared backend.
            </h1>
            <p className="max-w-3xl text-lg text-black/70">
              The point of comparison is the sharpness of difference. Each variant keeps its own layout, pacing,
              typography, and tone so the final choice remains real instead of collapsing into a mixed compromise.
            </p>
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium">Current rule</p>
            <p className="mt-2 text-sm text-black/65">
              Universalize backend, auth, repository and media contracts only. Keep frontend faces independent.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] opacity-70">Available variants</p>
          <h2 className="text-3xl font-semibold md:text-5xl">Compare families, not colors.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant) => (
            <VariantCatalogCard key={variant.id} variant={variant} />
          ))}
        </div>
      </section>
    </main>
  );
}
