import { DeepImmersionAbout } from "@/components/public/deep-immersion";
import { ColdMistAbout } from "@/components/public/cold-mist";
import { CopperGlowAbout } from "@/components/public/copper-glow";
import { EthericPulseAbout } from "@/components/public/etheric-pulse";
import { SageSandAbout } from "@/components/public/sage-sand";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { assertVariantSupportsRoute, getVariantOrThrow, listVariants } from "@/features/variants";

export function generateStaticParams() {
  return listVariants().filter((variant) => variant.supportedRoutes.includes("about")).map((variant) => ({ variant: variant.id }));
}

export default async function VariantAboutPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("about", manifest.supportedRoutes);

  if (manifest.id === "deep-immersion") return <><DeepImmersionAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
  if (manifest.id === "cold-mist") return <><ColdMistAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;
  if (manifest.id === "sage-sand") return <><SageSandAbout manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="about" /></>;

  return (
    <>
      <VariantShell manifest={manifest} content={content} currentRoute="about">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.about.eyebrow}</p>
              <h1 className="text-3xl font-semibold md:text-5xl">{content.about.title}</h1>
            </div>
            <div className={`space-y-5 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8">{paragraph}</p>
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
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="about" />
    </>
  );
}
