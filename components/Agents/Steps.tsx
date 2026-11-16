/** Numbered spec rows: step number, short title, one or two lines of detail. */
export default function Steps({ steps }: { steps: { title: string; detail: string }[] }) {
  return (
    <ol className="border-t border-rule">
      {steps.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[44px_1fr] gap-x-4 border-b border-rule py-5 md:grid-cols-[64px_260px_1fr] md:gap-x-8">
          <span className="font-mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-ink">{s.title}</span>
          <span className="col-start-2 mt-2 text-[15px] leading-relaxed text-muted md:col-start-3 md:mt-0">{s.detail}</span>
        </li>
      ))}
    </ol>
  );
}
