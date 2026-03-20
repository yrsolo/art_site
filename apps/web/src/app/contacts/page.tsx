import { SectionTitle } from "@/components/section-title";
import { SiteShell } from "@/components/site-shell";
import { getCurrentTheme } from "@/server/theme";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const theme = await getCurrentTheme();

  return (
    <SiteShell theme={theme} currentPath="/contacts" currentThemeId={theme.id}>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Contacts"
          title="A lightweight contact surface for collectors, curators, and collaborations."
          description="This is still local MVP content, but the structure is ready for real contact channels and policy text."
        />
        <div className="grid gap-6 md:grid-cols-2">
          <div className={`rounded-[2rem] p-8 ${theme.cardClassName}`}>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Direct</p>
            <div className="mt-5 space-y-4 text-base">
              <p>Email: artist@example.com</p>
              <p>Instagram: @artist.studio</p>
              <p>Location: Moscow / remote friendly</p>
            </div>
          </div>
          <div className={`rounded-[2rem] p-8 ${theme.cardClassName}`}>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">For the next step</p>
            <div className="mt-5 space-y-4 text-sm">
              <p>Swap the placeholder contacts with the final ones.</p>
              <p>Add inquiry forms only if they are actually needed after MVP.</p>
              <p>Keep the page static until infrastructure work starts.</p>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
