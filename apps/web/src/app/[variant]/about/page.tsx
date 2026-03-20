import { VariantShell } from "@/components/public/variant-shell";
import { assertVariantSupportsRoute, getVariantOrThrow } from "@/features/variants";

export const dynamic = "force-dynamic";

type VariantAboutPageProps = {
  params: Promise<{ variant: string }>;
};

export default async function VariantAboutPage({ params }: VariantAboutPageProps) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("about", manifest.supportedRoutes);

  return (
    <VariantShell manifest={manifest} content={content} currentRoute="about">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.about.eyebrow}</p>
            <h1 className="text-3xl font-semibold md:text-5xl">{content.about.title}</h1>
          </div>
          <div className={`space-y-5 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <aside className={`space-y-4 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
          <p className="text-xs uppercase tracking-[0.25em] opacity-70">Design invariants</p>
          <ul className={`space-y-3 text-sm ${manifest.classes.subtle}`}>
            {manifest.designInvariants.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </VariantShell>
  );
}
