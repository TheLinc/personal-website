import type { ReactNode } from "react";
import type { Project } from "@/content/site";
import type { Diagram } from "./diagrams";
import ArchDiagram from "./ArchDiagram";

export default function CaseStudy({
  project,
  header,
  diagram,
  index,
}: {
  project: Project;
  header: ReactNode;
  diagram: Diagram;
  index: number;
}) {
  const [primary, ...secondary] = project.links;
  return (
    <article className="border-t border-rule py-16 md:py-24" aria-labelledby={`${project.id}-name`}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p className="fig">
          Fig. {index + 3} — Case study {String(index + 1).padStart(2, "0")}
        </p>
        <a href={primary.href} className="fig text-accent hover:text-ink">
          {primary.label} ↗
        </a>
      </div>

      <h3 id={`${project.id}-name`} className="display mt-4 text-[clamp(48px,8vw,112px)]">
        {project.name}
      </h3>
      <p className="mt-5 max-w-[52ch] text-lg leading-snug md:text-xl">{project.oneLiner}</p>

      <div className="mt-10 border border-rule bg-bg-2">{header}</div>

      {/* Callouts: each value sits on a dimension line with end ticks */}
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {project.callouts.map((c) => (
          <div key={c.label}>
            <div className="relative mb-3 h-2 border-b border-faint before:absolute before:bottom-0 before:left-0 before:h-2 before:w-px before:bg-faint after:absolute after:bottom-0 after:right-0 after:h-2 after:w-px after:bg-faint" />
            <dt className="sr-only">{c.label}</dt>
            <dd className="display text-[clamp(28px,3.4vw,44px)] text-accent">{c.value}</dd>
            <p className="fig mt-2 normal-case tracking-normal">{c.label}</p>
          </div>
        ))}
      </dl>

      <div className="mt-14 grid gap-12 lg:grid-cols-[5fr_7fr]">
        <ul className="space-y-4 text-[15px] leading-relaxed text-muted">
          {project.body.map((b) => (
            <li key={b} className="grid grid-cols-[18px_1fr]">
              <span className="text-accent">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div>
          <ArchDiagram diagram={diagram} />
          <p className="mt-6 font-mono text-[12px] leading-relaxed text-muted">{project.tech.join(" · ")}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.08em]">
            {[primary, ...secondary].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-u">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
