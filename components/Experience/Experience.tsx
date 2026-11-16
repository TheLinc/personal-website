import { education, roles, shortRoles } from "@/content/site";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
      <p className="fig">Fig. 5 — Experience</p>
      <h2 className="display mt-3 text-[clamp(40px,6vw,80px)] text-muted">Where I&apos;ve worked</h2>

      <div className="mt-12">
        {roles.map((r) => (
          <article key={r.company} className="grid gap-4 border-t border-rule py-10 md:grid-cols-[220px_1fr] md:gap-10">
            <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">
              <p className="text-ink">{r.period}</p>
              <p className="mt-1">{r.place}</p>
            </div>
            <div>
              <h3 className="display text-[clamp(32px,4vw,52px)]">{r.company}</h3>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-accent">{r.role}</p>
              <ul className="mt-6 grid gap-x-10 gap-y-3 text-[15px] leading-relaxed text-muted lg:grid-cols-2">
                {r.points.map((pt) => (
                  <li key={pt} className="grid grid-cols-[18px_1fr]">
                    <span className="text-faint">—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <table className="w-full border-t border-rule text-left text-sm">
          <caption className="fig py-6 text-left">Earlier roles and education</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Years</th>
              <th scope="col">Organization</th>
              <th scope="col">Role</th>
              <th scope="col">Summary</th>
            </tr>
          </thead>
          <tbody>
            {shortRoles.map((r) => (
              <tr key={r.company} className="border-t border-rule align-top">
                <td className="w-[110px] py-4 pr-6 font-mono text-[12px] text-muted md:w-[260px]">{r.year}</td>
                <td className="py-4 pr-6">
                  <span className="text-ink">{r.company}</span>
                  <span className="block text-muted md:hidden">{r.role}</span>
                </td>
                <td className="hidden py-4 pr-6 text-muted md:table-cell">{r.role}</td>
                <td className="hidden py-4 text-muted lg:table-cell">{r.line}</td>
              </tr>
            ))}
            <tr className="border-y border-rule align-top">
              <td className="py-4 pr-6 font-mono text-[12px] text-muted">{education.years}</td>
              <td className="py-4 pr-6">
                <span className="text-ink">{education.school}</span>
                <span className="block text-muted md:hidden">{education.degree}</span>
              </td>
              <td className="hidden py-4 text-muted md:table-cell" colSpan={2}>
                {education.degree}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
