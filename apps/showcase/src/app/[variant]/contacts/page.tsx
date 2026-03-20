import { ColdMistContacts } from "@/components/public/cold-mist";
import { CopperGlowContacts } from "@/components/public/copper-glow";
import { EthericPulseContacts } from "@/components/public/etheric-pulse";
import { MintRoseContacts } from "@/components/public/mint-rose";
import { OliveCreamContacts } from "@/components/public/olive-cream";
import { SageSandContacts } from "@/components/public/sage-sand";
import { VariantShell } from "@/components/public/variant-shell";
import { VariantSwitcher } from "@/components/public/variant-switcher";
import { assertVariantSupportsRoute, getVariantOrThrow, listVariants } from "@/features/variants";

export function generateStaticParams() {
  return listVariants().filter((variant) => variant.supportedRoutes.includes("contacts")).map((variant) => ({ variant: variant.id }));
}

export default async function VariantContactsPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("contacts", manifest.supportedRoutes);

  if (manifest.id === "cold-mist") return <><ColdMistContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
  if (manifest.id === "copper-glow") return <><CopperGlowContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
  if (manifest.id === "etheric-pulse") return <><EthericPulseContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
  if (manifest.id === "mint-rose") return <><MintRoseContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
  if (manifest.id === "olive-cream") return <><OliveCreamContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;
  if (manifest.id === "sage-sand") return <><SageSandContacts manifest={manifest} content={content} /><VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" /></>;

  return (
    <>
      <VariantShell manifest={manifest} content={content} currentRoute="contacts">
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`space-y-5 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] opacity-70">{content.contacts.eyebrow}</p>
              <h1 className="text-3xl font-semibold md:text-5xl">{content.contacts.title}</h1>
              <p className={`text-base ${manifest.classes.subtle}`}>{content.contacts.description}</p>
            </div>
            <div className="space-y-3 text-sm">
              {content.contacts.channels.map((channel) => (
                <p key={channel}>{channel}</p>
              ))}
            </div>
          </div>
          <div className={`space-y-4 p-8 ${manifest.classes.card} ${manifest.classes.pill}`}>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Do not dilute</p>
            <ul className={`space-y-3 text-sm ${manifest.classes.subtle}`}>
              {manifest.doNotDilute.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <div className={`pt-4 ${manifest.classes.subtle}`}>
              <p className={`inline-flex px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>{content.contacts.inquiryLabel}</p>
            </div>
          </div>
        </div>
      </VariantShell>
      <VariantSwitcher currentVariantId={manifest.id} currentRoute="contacts" />
    </>
  );
}
