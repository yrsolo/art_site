import { VariantShell } from "@/components/public/variant-shell";
import { assertVariantSupportsRoute, getVariantOrThrow } from "@/features/variants";

export const dynamic = "force-dynamic";

type VariantContactsPageProps = {
  params: Promise<{ variant: string }>;
};

export default async function VariantContactsPage({ params }: VariantContactsPageProps) {
  const { variant } = await params;
  const { manifest, content } = getVariantOrThrow(variant);
  assertVariantSupportsRoute("contacts", manifest.supportedRoutes);

  return (
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
            <p className={`inline-flex px-4 py-3 text-sm font-medium ${manifest.classes.accent} ${manifest.classes.pill}`}>
              {content.contacts.inquiryLabel}
            </p>
          </div>
        </div>
      </div>
    </VariantShell>
  );
}
