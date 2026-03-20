import { SectionTitle } from "@/components/section-title";
import { SiteShell } from "@/components/site-shell";
import { getCurrentTheme } from "@/server/theme";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const theme = await getCurrentTheme();

  return (
    <SiteShell theme={theme} currentPath="/about" currentThemeId={theme.id}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-6">
          <SectionTitle
            eyebrow="About the artist"
            title="A flexible about page that can absorb the real biography later without changing the structure."
            description="For now this page holds clean editorial content and inherits the currently selected theme."
          />
          <div className={`space-y-5 rounded-[2rem] p-8 ${theme.cardClassName}`}>
            <p>
              The painter&apos;s practice focuses on atmosphere, memory, and the emotional weight of texture. In the
              MVP we keep this page intentionally simple so the real biography, statement, and exhibitions can be
              inserted later with minimal refactoring.
            </p>
            <p>
              The important part for the codebase is that this page already lives inside the shared public shell and
              theme system, so content can evolve independently from the layout.
            </p>
          </div>
        </div>
        <aside className={`rounded-[2rem] p-8 ${theme.cardClassName}`}>
          <p className="text-xs uppercase tracking-[0.25em] opacity-70">Studio notes</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li>Mediums can later become structured profile metadata.</li>
            <li>Press links and exhibitions can be added as optional content blocks.</li>
            <li>No theme-specific data is hardcoded into the repository layer.</li>
          </ul>
        </aside>
      </div>
    </SiteShell>
  );
}
