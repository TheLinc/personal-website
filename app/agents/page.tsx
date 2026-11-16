import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import ContextDiagram from "@/components/Agents/ContextDiagram";
import Steps from "@/components/Agents/Steps";

export const metadata: Metadata = {
  title: "/agents — How I run coding agents at scale · Lincoln Laylor",
  description:
    "tackle and tackle-board: two Claude Code skills that give every ticket its own agent, worktree and small context, and run several at once without scope creep.",
  alternates: { canonical: "https://lincolnlaylor.com/agents" },
};

const TACKLE = [
  { title: "Claim", detail: "Post a claim comment with a token unique to the session, then re-read the claims. The first one wins, so two agents handed the same ticket at the same second can't both start it." },
  { title: "Read only what matters", detail: "The ticket, its comments, linked tickets, the project's docs, and whatever else is In Progress or In Review that touches the same files. Nothing else enters the context." },
  { title: "Impact check", detail: "Before planning, list what the change could break outside the obvious files: callers, shared components, API and data shapes, tickets in flight. Prove the fact the change's safety depends on with a run, not prose." },
  { title: "Branch", detail: "From an up-to-date default branch, named <type>/<ID>-<slug>, in the ticket's own git worktree." },
  { title: "Plan on the ticket", detail: "Approach, files, impact notes, test plan and what's deliberately out of scope go on the ticket as a comment, so the work survives if the session dies." },
  { title: "Implement", detail: "Follow existing patterns. Small adaptations this change needs are in; larger changes to other features become follow-up tickets instead of scope creep." },
  { title: "Verify", detail: "Lint, typecheck and tests pass, then a fresh subagent tests the behaviour from the acceptance criteria, not from the implementer's notes." },
  { title: "File follow-ups", detail: "Bugs and work found along the way are written up as tickets, linked back, and left for another agent." },
  { title: "Review, then PR", detail: "A review loop with fresh reviewer agents runs until a round finds nothing that matters. Then the PR opens, the ticket moves to In Review, and merging waits for me." },
];

const BOARD = [
  { title: "Never writes code", detail: "The orchestrator only reads the board and launches threads. Each ticket gets its own top-level thread in its own worktree running tackle." },
  { title: "Eligible tickets", detail: "Todo, triaged with a priority, no open blocker (native links or \"Blocked by #N\"), and no claim, branch or open PR already pointing at it." },
  { title: "Priority, inherited", detail: "A ticket's priority is raised to the highest priority of anything it blocks, directly or through a chain, so a Low prerequisite of a High ticket doesn't wait forever." },
  { title: "No conflicts", detail: "Tickets that block each other, share a parent, or touch the same area don't run at the same time." },
  { title: "N slots, counted from the board", detail: "At most N tickets in progress (3 by default, about 9 agents at peak with each thread's tester and reviewer). A slot frees only when its ticket leaves In Progress, so a thread waiting on me still holds it." },
  { title: "Refill", detail: "Every pass re-reads the board: follow-up tickets, changed priorities and closed blockers are picked up, and free slots are filled in priority order." },
];

const WHY = [
  { title: "Small context", detail: "Each agent sees one ticket and the code around it. Nothing from the last ticket's dead ends leaks into this one." },
  { title: "Isolation", detail: "A worktree per ticket means parallel agents never edit the same checkout." },
  { title: "Scope stays put", detail: "Anything outside the ticket becomes a new ticket, not a bigger diff." },
  { title: "A hard cap", detail: "N slots keeps review load, CI and my attention bounded, however long the board is." },
];

export default function AgentsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl px-5 pt-28 md:px-10 md:pt-36">
        <p className="fig">Fig. A — /agents</p>
        <h1 className="display mt-4 text-[clamp(52px,10vw,148px)]">
          Small contexts,
          <br />
          <span className="text-accent">many agents</span>
        </h1>
        <p className="mt-8 max-w-[60ch] text-lg leading-snug md:text-xl">
          The spike in my{" "}
          <Link href="/" className="link-u text-ink">
            commit terrain
          </Link>{" "}
          is several Claude Code agents working in parallel. Two skills I wrote, <code className="font-mono text-accent">/tackle</code> and{" "}
          <code className="font-mono text-accent">/tackle-board</code>, are what keep that from turning into
          a mess.
        </p>

        <section className="mt-24" aria-labelledby="problem">
          <p className="fig">A.1</p>
          <h2 id="problem" className="display mt-2 text-[clamp(32px,4.4vw,60px)]">
            The problem
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-relaxed text-muted">
            An agent&apos;s context window is its working memory. Leave one agent on a long task and it fills
            with every file it opened, every failed attempt and every unrelated ticket. Models get worse at
            using what&apos;s in there as it grows: early instructions get lost, old dead ends steer new
            decisions, and &ldquo;while I&apos;m here&rdquo; changes creep into the diff. The fix isn&apos;t a bigger
            window. It&apos;s less in each one.
          </p>
          <div className="mt-14">
            <ContextDiagram />
          </div>
          <p className="fig mt-6">Scroll to run it. Left: one agent, nine tickets. Right: the same nine through three slots.</p>
        </section>

        <section className="mt-28" aria-labelledby="tackle">
          <p className="fig">A.2</p>
          <h2 id="tackle" className="display mt-2 text-[clamp(32px,4.4vw,60px)]">
            /tackle — one ticket, one agent
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-relaxed text-muted">
            Takes a ticket from Todo to a reviewed pull request, acting like a senior developer on a team
            where other agents are working other tickets right now.
          </p>
          <div className="mt-10">
            <Steps steps={TACKLE} />
          </div>
        </section>

        <section className="mt-28" aria-labelledby="board">
          <p className="fig">A.3</p>
          <h2 id="board" className="display mt-2 text-[clamp(32px,4.4vw,60px)]">
            /tackle-board — the orchestrator
          </h2>
          <p className="mt-6 max-w-[64ch] text-[16px] leading-relaxed text-muted">
            Works a GitHub Project board in parallel, keeping at most N tickets in flight and refilling
            slots as they finish.
          </p>
          <div className="mt-10">
            <Steps steps={BOARD} />
          </div>
        </section>

        <section className="mt-28" aria-labelledby="why">
          <p className="fig">A.4</p>
          <h2 id="why" className="display mt-2 text-[clamp(32px,4.4vw,60px)]">
            Why it works
          </h2>
          <dl className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="border-t border-accent pt-5">
                <dt className="font-mono text-[13px] uppercase tracking-[0.06em] text-ink">{w.title}</dt>
                <dd className="mt-3 text-[15px] leading-relaxed text-muted">{w.detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-28 border-y border-rule py-16" aria-labelledby="openroom">
          <p className="fig">A.5</p>
          <h2 id="openroom" className="display mt-2 text-[clamp(32px,4.4vw,60px)]">
            Same idea, in Open Room
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            <p className="display text-[clamp(56px,8vw,112px)] text-accent">73 → n</p>
            <p className="max-w-[56ch] text-[16px] leading-relaxed text-muted">
              Every agent in{" "}
              <Link href="/#open-room-name" className="link-u text-ink">
                Open Room
              </Link>{" "}
              was inheriting 73 tools and 8 MCP servers from global settings, all described in its context
              on every turn. Turning off settings inheritance cut each agent to only the tools it&apos;s
              configured with and removed per-turn server startup. Less in the window, faster and more
              focused turns.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-x-8 gap-y-3 py-20 font-mono text-[12px] uppercase tracking-[0.08em]">
          <Link href="/#work" className="text-accent hover:text-ink">
            ← Selected work
          </Link>
          <Link href="/#contact" className="text-ink hover:text-accent">
            Contact
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
