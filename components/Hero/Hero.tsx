import Link from "next/link";
import type { Calendar } from "@/lib/contributions";
import Terrain from "@/components/Terrain/Terrain";

export default function Hero({ calendar }: { calendar: Calendar }) {
  const total = calendar.total.toLocaleString("en-US");
  const first = calendar.weeks[0]?.[0]?.date;
  const last = calendar.weeks.at(-1)?.at(-1)?.date;

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden border-b border-rule">
      <Terrain calendar={calendar} />

      {/* Legibility scrim behind the copy; the terrain stays bright on the right. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] md:block"
        style={{ background: "linear-gradient(90deg, var(--bg) 0%, rgba(11,11,10,0.86) 45%, rgba(11,11,10,0) 100%)" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 pb-40 pt-28 md:px-10 md:pb-16 md:pt-36">
        <p className="fig">
          Fig. 1 — GitHub contributions, last 12 months · <span className="text-ink">{total}</span>
        </p>

        <h1 className="display mt-6 text-[clamp(64px,19vw,168px)]">
          Lincoln
          <br />
          Laylor
        </h1>

        <p className="mt-8 max-w-[34ch] text-lg leading-snug text-ink md:text-xl">
          Full-stack engineer. I build agentic AI tooling and the products around it.
        </p>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">
          Full Stack Developer at Opinion System. Previously founding frontend engineer at Core
          Manufacturing. Ottawa, Canada.
        </p>

        <ul className="pointer-events-auto mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.08em]">
          <li>
            <Link href="#work" className="text-accent hover:text-ink">
              → Selected work
            </Link>
          </li>
          <li>
            <Link href="/agents" className="text-ink hover:text-accent">
              /agents
            </Link>
          </li>
          <li>
            <Link href="#contact" className="text-ink hover:text-accent">
              Contact
            </Link>
          </li>
        </ul>

        <p className="fig mt-auto hidden md:block">
          {first} → {last} · 1 column = 1 day · height = √contributions
        </p>
      </div>
    </section>
  );
}
