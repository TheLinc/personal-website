/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import type { Project } from "@/content/projects";

// One project: compact header, the live demo, then how it's built and the hardest problems.
export default function ProjectCard({ p, children }: { p: Project; children: ReactNode }) {
  return (
    <article className="card mt-6 p-5 first-of-type:mt-10 sm:p-8" aria-labelledby={p.id}>
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <img src={p.logo} alt={`${p.name} logo`} className="size-12 shrink-0 rounded-2xl sm:size-14" data-build="image" data-label={`${p.id}.png`} />
          <div className="min-w-0">
            <h3 id={p.id} className="text-3xl" data-build="text" data-label="h3">{p.name}</h3>
            <p className="mt-2 max-w-xl text-[#6d6962]" data-build="text" data-label="summary">{p.summary}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-sm md:justify-end" data-build="box" data-label="links">
          {p.links.map(([label, href]) => (
            <a key={href} className="chip !pl-3" href={href}>{label} ↗</a>
          ))}
        </div>
      </header>

      {p.stats && (
        <dl className="mt-5 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap md:pl-[72px]" data-build="box" data-label="stats">
          {p.stats.map(([v, l]) => (
            <div key={l} className="flex flex-col rounded-xl bg-[#f4f2ff] px-3 py-2 sm:flex-row sm:items-baseline sm:gap-2 sm:py-1.5">
              <dt className="sr-only">{l}</dt>
              <dd className="text-lg font-bold text-[#5b5bf0]">{v}</dd>
              <span aria-hidden className="text-xs text-[#6d6962]">{l}</span>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6">{children}</div>

      <div className="mt-8 grid gap-8 border-t border-[#ece7df] pt-7 md:grid-cols-[5fr_7fr] md:gap-10">
        <section aria-label={`How ${p.name} is built`} data-build="box" data-label="how it's built">
          <p className="label">How it’s built</p>
          <ol className="relative mt-4">
            {p.flow.map((s, i) => (
              <li key={s.step} className="relative flex gap-3 pb-5 last:pb-0">
                {i < p.flow.length - 1 && (
                  <span aria-hidden className="absolute top-7 bottom-0 left-[13px] w-px bg-[repeating-linear-gradient(#c9c4f5_0_4px,transparent_4px_8px)]" />
                )}
                <span className="relative grid size-7 shrink-0 place-items-center rounded-full bg-[#ecebfe] text-xs font-bold text-[#4646c8]">{i + 1}</span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-semibold leading-snug">{s.step}</p>
                  <p className="mt-0.5 text-sm text-[#6d6962]">{s.detail}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.tech.map(([name, icon]) => (
                      <li key={name} className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e3da] bg-white py-0.5 pr-2.5 pl-1 text-xs font-medium">
                        {icon ? (
                          <img src={`/assets/icons/${icon}`} alt="" className="size-5 object-contain" />
                        ) : (
                          <span aria-hidden className="grid size-5 place-items-center rounded-full bg-[#f4f2ff] text-[10px] text-[#5b5bf0]">{name[0]}</span>
                        )}
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label={`Hardest problems in ${p.name}`} data-build="box" data-label="challenges">
          <p className="label">Hardest problems</p>
          <ol className="mt-4 space-y-4">
            {p.challenges.map((c, i) => (
              <li key={c.title} className="rounded-2xl border border-[#ece7df] bg-[#fbfaf7] p-4">
                <p className="flex gap-2 font-semibold leading-snug">
                  <span className="mono text-xs leading-6 text-[#9a958c]">0{i + 1}</span>
                  {c.title}
                </p>
                <p className="mt-1.5 text-sm text-[#6d6962]">{c.problem}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-[#0d7a5f]">What I did: </span>
                  {c.fix}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
