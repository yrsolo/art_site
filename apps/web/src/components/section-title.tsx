type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.25em] opacity-70">{eyebrow}</p>
      <h2 className="max-w-3xl text-3xl font-semibold md:text-5xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base opacity-75 md:text-lg">{description}</p> : null}
    </div>
  );
}
