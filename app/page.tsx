/* eslint-disable @next/next/no-img-element */
import { getCalendar } from "@/lib/github";
import BuildEngine from "@/components/site/BuildEngine";
import Bust from "@/components/hero/Bust";
import HeroLines from "@/components/hero/HeroLines";
import CareerGrep from "@/components/site/CareerGrep";
import IconPile from "@/components/site/IconPile";
import CoverMeProduct from "@/components/products/cover-me/CoverMeProduct";
import OpenRoomDemo from "@/components/site/OpenRoomDemo";
import Experience from "@/components/site/Experience";
import ProjectCard from "@/components/site/ProjectCard";
import AgentRules from "@/components/site/AgentRules";
import Fragments from "@/components/site/Fragments";
import { COVER_ME, OPEN_ROOM } from "@/content/projects";
import ContributionGraph, { contributionStats, fmtDay } from "@/components/site/ContributionGraph";
import { CHECKS, EMAIL, GITHUB, LINKEDIN, REVIEWS } from "@/content/site";

export const revalidate = 86400;

/** A logo chip taped to the hero; clicking it scrolls to that part of the page. */
function Pinned({ src, name, to }: { src: string; name: string; to: string }) {
  return (
    <a href={to} className="chip taped">
      <img src={src} alt="" />
      {name}
    </a>
  );
}

function Heading({ label, title, id }: { label: string; title: string; id?: string }) {
  return (
    <>
      <p className="label" data-build="text" data-label="label">
        {label}
      </p>
      <h2 id={id} className="mt-3 text-[clamp(30px,5vw,56px)]" data-build="text" data-label="h2">
        {title}
      </h2>
    </>
  );
}

export default async function Home() {
  const cal = await getCalendar();
  const s = contributionStats(cal);
  const total = cal.total.toLocaleString("en-US");

  return (
    <div className="site">
      <BuildEngine />

      <header className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-6 pt-6 text-sm">
        <a href="#top" className="whitespace-nowrap font-semibold">
          Lincoln Laylor
        </a>
        <nav className="flex gap-4 whitespace-nowrap text-[#6d6962] sm:gap-6" aria-label="Sections">
          <a href="#work" className="hover:text-[#1d1c1a]">Work</a>
          <a href="#experience" className="hover:text-[#1d1c1a]">Experience</a>
          <a href="#hire" className="hover:text-[#1d1c1a]">Contact</a>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <HeroLines />
          <div className="hero-grid">
            <div className="hero-left">
              <p className="chip w-fit !pl-3 text-[13px]">
                <span className="live-dot" />
                Shipping · last commit {s.daysAgo === 0 ? "today" : `${s.daysAgo}d ago`} · {total} this year
              </p>
              <h1 className="hero-name mt-6">
                Lincoln
                <br />
                Laylor.
              </h1>
            </div>
            <Bust />
            <p className="hero-say">
              Ships with
              <br />
              agents.
            </p>
            <div className="hero-sub">
              <p className="max-w-[34ch] text-[clamp(17px,1.6vw,20px)] leading-snug text-[#4a4741]">
                Full-stack engineer. I build AI products, and the agent workflows that ship them. Full Stack Developer at Opinion System, where I lead AI integrations. Ottawa, Canada.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#work" className="rounded-full bg-[#1d1c1a] px-5 py-3 text-sm font-semibold text-white">
                  See the work ↓
                </a>
                <a href={`mailto:${EMAIL}`} className="rounded-full border border-[#e8e3da] bg-white px-5 py-3 text-sm font-semibold">
                  Email me
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-4">
                <Pinned src="/assets/os.png" name="Opinion System" to="#opinion-system" />
                <Pinned src="/assets/coverme.png" name="Cover Me" to="#cover-me" />
              </div>
            </div>
          </div>
        </section>

        {/* How I ship with agents */}
        <section id="agents" className="relative isolate mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Fragments of="agents" />
          <Heading label="How I ship with agents" title="Eight rules my agents follow" />
          <AgentRules />
        </section>

        {/* Experience */}
        <section id="experience" className="relative isolate mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Fragments of="experience" />
          <Heading label="git log --graph --career" title="Where I’ve worked" />
          <Experience />
        </section>

        {/* Work */}
        <section id="work" className="relative isolate mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Fragments of="work" />
          <Heading label="Built this way" title="Things I’ve built this way" />

          <ProjectCard p={COVER_ME}>
            <div className="rounded-2xl border border-[#e8e3da] bg-[#f6f3ee] px-3 py-6 sm:px-6 sm:py-8">
              <CoverMeProduct />
            </div>
          </ProjectCard>

          <ProjectCard p={OPEN_ROOM}>
            <OpenRoomDemo />
          </ProjectCard>
        </section>

        {/* GitHub */}
        <section className="relative isolate mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24" aria-labelledby="github">
          <Fragments of="github" />
          <div className="card p-5 sm:p-8">
            <p className="label" data-build="text" data-label="label">
              <a href={GITHUB} className="hover:text-[#1d1c1a]">github.com/TheLinc</a> · live
            </p>
            <h2 id="github" className="mt-3 text-[clamp(24px,4vw,44px)]" data-build="text" data-label="h2">
              {total} contributions in the last year
            </h2>
            <div className="mt-6">
              <ContributionGraph cal={cal} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                [`${s.busiest.count}`, `busiest day · ${fmtDay(s.busiest.date)}`],
                [`${s.best} days`, "longest streak"],
                [s.daysAgo === 0 ? "today" : `${s.daysAgo}d ago`, "last commit"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-[#e8e3da] p-3 sm:p-4" data-build="box" data-label={l}>
                  <div className="text-lg font-bold sm:text-2xl">{v}</div>
                  <div className="text-xs text-[#6d6962] sm:text-sm">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="relative isolate mx-auto mb-16 max-w-5xl px-5 pb-48 sm:px-6">
          <Fragments of="skills" />
          <IconPile />
          <div className="relative z-10">
            <Heading label="Skills" title="Search my experience" />
            <CareerGrep />
          </div>
        </section>

        {/* Reviews */}
        <section className="relative isolate mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Fragments of="reviews" />
          <Heading label="Code review" title="Approved by people I’ve worked with" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="card p-5" data-build="box" data-label={`review: ${r.name}`}>
                <div className="flex items-center gap-3 text-sm">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#ecebfe] font-bold text-[#4646c8]">{r.name[0]}</span>
                  <span>
                    <b>{r.name}</b> <span className="text-[#0d7a5f]">approved</span>
                  </span>
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-4 text-xs text-[#6d6962]">{r.role}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Hire PR */}
        <section id="hire" className="relative isolate mx-auto max-w-3xl px-5 pb-16 sm:px-6" aria-labelledby="hire-title">
          <Fragments of="hire" />
          <div className="card overflow-hidden">
            <div className="border-b border-[#e8e3da] p-5 sm:p-6" data-build="box" data-label="pull request">
              <p className="flex items-center gap-2 text-sm">
                <span className="rounded-full bg-[#11a37f] px-2.5 py-1 text-xs font-semibold text-white">Open</span>
                <span className="mono text-[#6d6962]">#1</span>
              </p>
              <h2 id="hire-title" className="mt-3 text-[clamp(28px,4vw,40px)]">Hire Lincoln</h2>
              <p className="mt-2 text-sm text-[#6d6962]">
                <b className="text-[#1d1c1a]">lincoln</b> wants to merge 4+ years of shipping into{" "}
                <span className="mono whitespace-nowrap rounded bg-[#f1eee8] px-1.5 py-0.5">your-team:main</span>
              </p>
            </div>
            <ul className="divide-y divide-[#efebe3]">
              {CHECKS.map(([name, detail]) => (
                <li key={name} className="flex items-start gap-3 px-5 py-3.5 text-sm sm:items-center sm:px-6" data-build="check" data-label={`check: ${name}`}>
                  <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center sm:mt-0">
                    <span className="spin absolute size-4 rounded-full border-2 border-[#e2b93b] border-t-transparent" />
                    <span className="tick absolute grid size-5 place-items-center rounded-full bg-[#11a37f] text-[11px] text-white">✓</span>
                  </span>
                  <span className="flex flex-wrap gap-x-3">
                    <b>{name}</b>
                    <span className="text-[#6d6962]">{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 border-t border-[#e8e3da] bg-[#f7fbf9] p-5 sm:p-6" data-build="box" data-label="merge">
              <a href={`mailto:${EMAIL}?subject=Merging%20PR%20%231`} className="rounded-xl bg-[#11a37f] px-5 py-3 text-sm font-semibold text-white">
                Merge pull request
              </a>
              <div className="flex gap-2.5">
                <a href={GITHUB} className="chip !pl-3 text-sm">
                  <svg viewBox="0 0 24 24" className="size-[18px]" fill="#181717" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" /></svg>
                  GitHub ↗
                </a>
                <a href={LINKEDIN} className="chip !pl-3 text-sm">
                  <svg viewBox="0 0 24 24" className="size-[18px]" fill="#0a66c2" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" /></svg>
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mono mx-auto max-w-5xl px-5 pb-28 text-center text-xs text-[#6d6962] sm:px-6" data-build="text" data-label="footer">
        Built in front of you by six agents. © 2026 Lincoln Laylor
      </footer>
    </div>
  );
}
