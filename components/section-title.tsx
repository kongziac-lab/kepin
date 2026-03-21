type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <div
        className="mb-5 inline-block text-xs font-bold uppercase tracking-[0.18em]"
        style={{ color: "#ef4444" }}
      >
        {eyebrow}
      </div>
      <h2 className="section-title">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-white/48">{description}</p>
      ) : null}
    </div>
  );
}
