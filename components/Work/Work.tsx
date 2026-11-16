import { earlierWork, projects } from "@/content/site";
import CaseStudy from "./CaseStudy";
import Tailoring from "./Tailoring";
import { coverMeDiagram, openRoomDiagram } from "./diagrams";

const diagrams = { "cover-me": coverMeDiagram, "open-room": openRoomDiagram };
const headers = {
  "cover-me": <Tailoring />,
  "open-room": <div className="aspect-[16/7]" />,
};

export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-32">
      <p className="fig">Selected work</p>
      <h2 className="display mt-3 text-[clamp(40px,6vw,80px)] text-muted">Things I shipped</h2>

      <div className="mt-12">
        {projects.map((p, i) => (
          <CaseStudy key={p.id} project={p} index={i} diagram={diagrams[p.id]} header={headers[p.id]} />
        ))}
      </div>

      <div className="border-t border-rule py-12">
        <p className="fig">Earlier work</p>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {earlierWork.map((w) => (
            <li key={w.name} className="text-sm text-muted">
              {w.href ? (
                <a href={w.href} className="link-u text-ink">
                  {w.name} ↗
                </a>
              ) : (
                <span className="text-ink">{w.name}</span>
              )}
              <span className="mt-1 block">{w.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
