import Link from "next/link";

import { listVariants } from "@/features/variants";
import { templateMedia } from "@/features/variants/template-media";

export default function HomePage() {
  const variants = listVariants();

  return (
    <main className="min-h-screen bg-[#f2eee7] text-[#1e1c18]">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-12 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-black/45">Каталог вариантов</p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Выберите лицо сайта, а не усреднённый компромисс.
          </h1>
          <p className="max-w-2xl text-base text-black/55 md:text-lg">
            Каждый квадрат открывает отдельную фронт-морду. Бэкенд общий, художественное прочтение нет.
          </p>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant) => (
            <article key={variant.id} className="space-y-4">
              <Link href={`/${variant.id}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={templateMedia.catalog[variant.id as keyof typeof templateMedia.catalog]}
                    alt={variant.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em]">{variant.label}</h2>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-black/45">
                  {variant.family.replace("_", " ")}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/${variant.id}`}
                  className="inline-flex min-w-[8.5rem] items-center justify-center border border-black/15 px-4 py-3 text-sm uppercase tracking-[0.14em] hover:border-black/35"
                >
                  Открыть
                </Link>
                <Link
                  href={`/${variant.id}/gallery`}
                  className="inline-flex min-w-[8.5rem] items-center justify-center border border-black/15 px-4 py-3 text-sm uppercase tracking-[0.14em] hover:border-black/35"
                >
                  Галерея
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
