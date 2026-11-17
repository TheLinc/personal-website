/* eslint-disable @next/next/no-img-element */
import { getCalendar } from "@/lib/github";
import BuildEngine from "@/components/site/BuildEngine";
import HeroCharacter from "@/components/site/HeroCharacter";
import CareerGrep from "@/components/site/CareerGrep";
import IconPile from "@/components/site/IconPile";
import CoverMeProduct from "@/components/products/cover-me/CoverMeProduct";
import OpenRoomDemo from "@/components/site/OpenRoomDemo";
import Experience from "@/components/site/Experience";
import ProjectCard from "@/components/site/ProjectCard";
import { COVER_ME, OPEN_ROOM } from "@/content/projects";
import ContributionGraph, { contributionStats, fmtDay } from "@/components/site/ContributionGraph";
import { CHECKS, EMAIL, GITHUB, LINKEDIN, REVIEWS } from "@/content/site";

export const revalidate = 86400;

function Logo({ src, name }: { src: string; name: string }) {
  return (
    <span className="chip" data-build="image" data-label={`${name} logo`}>
      <img src={src} alt="" />
      {name}
    </span>
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

      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 pt-6 text-sm sm:px-6">
        <a href="#top" className="whitespace-nowrap font-semibold" data-build="text" data-label="name">
          Lincoln Laylor
        </a>
        <nav className="flex gap-4 whitespace-nowrap text-[#6d6962] sm:gap-6" data-build="box" data-label="nav" aria-label="Sections">
          <a href="#work" className="hover:text-[#1d1c1a]">Work</a>
          <a href="#experience" className="hover:text-[#1d1c1a]">Experience</a>
          <a href="#hire" className="hover:text-[#1d1c1a]">Contact</a>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto grid max-w-5xl items-center gap-6 px-5 pb-16 pt-14 sm:px-6 md:pt-24 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pb-20">
          <div>
            <p className="chip w-fit !pl-3 text-[13px]" data-build="box" data-label="status">
              <span className="live-dot" />
              Shipping · last commit {s.daysAgo === 0 ? "today" : `${s.daysAgo}d ago`} · {total} this year
            </p>
            <h1 className="mt-6 text-[clamp(44px,7vw,84px)]" data-build="text" data-label="h1">
              Lincoln Laylor
            </h1>
            <p className="mt-4 max-w-[30ch] text-[clamp(21px,3vw,32px)] leading-tight" data-build="text" data-label="tagline">
              Full-stack engineer. I build AI products, and the agent workflows that ship them.
            </p>
            <p className="mt-4 max-w-[56ch] text-[#6d6962]" data-build="text" data-label="intro">
              Full Stack Developer at Opinion System, where I lead AI integrations. Building Cover Me on the side. Ottawa, Canada.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Logo src="/assets/os.png" name="Opinion System" />
              <Logo src="/assets/coverme.png" name="Cover Me" />
            </div>
            <div className="mt-8 flex flex-wrap gap-3" data-build="box" data-label="actions">
              <a href="#work" className="rounded-full bg-[#1d1c1a] px-5 py-3 text-sm font-semibold text-white">
                See the work ↓
              </a>
              <a href={`mailto:${EMAIL}`} className="rounded-full border border-[#e8e3da] bg-white px-5 py-3 text-sm font-semibold">
                Email me
              </a>
            </div>
          </div>
          <HeroCharacter wave="/assets/me-wave.mp4" loop="/assets/me-loop.mp4" />
        </section>

        {/* GitHub */}
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24" aria-labelledby="github">
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

        {/* Work */}
        <section id="work" className="mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Heading label="Selected work" title="Things I’ve shipped" />

          <ProjectCard p={COVER_ME}>
            <div className="rounded-2xl border border-[#e8e3da] bg-[#f6f3ee] px-3 py-6 sm:px-6 sm:py-8" data-build="box" data-label="extension demo">
              <CoverMeProduct />
            </div>
          </ProjectCard>

          <ProjectCard p={OPEN_ROOM}>
            <div data-build="box" data-label="app demo">
              <OpenRoomDemo />
            </div>
          </ProjectCard>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
          <Heading label="git log --graph --career" title="Where I’ve worked" />
          <Experience />
        </section>

        {/* Skills */}
        <section className="relative mx-auto mb-16 max-w-5xl px-5 pb-48 sm:px-6">
          <IconPile />
          <div className="relative z-10">
            <Heading label="Skills" title="Search my experience" />
            <CareerGrep />
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-6 sm:pb-24">
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
        <section id="hire" className="mx-auto max-w-3xl px-5 pb-16 sm:px-6" aria-labelledby="hire-title">
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
              <a href={GITHUB} className="chip !pl-3 text-sm">GitHub ↗</a>
              <a href={LINKEDIN} className="chip !pl-3 text-sm">LinkedIn ↗</a>
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
