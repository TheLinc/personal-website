import Link from "next/link";
import { ContextDiagramStatic } from "@/components/Agents/ContextDiagram";

export default function AgentsTeaser() {
  return (
    <section id="agents" className="border-y border-rule bg-bg-2">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32">
        <p className="fig">Fig. 6 — Context per agent</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
          <h2 className="display text-[clamp(40px,6vw,80px)]">
            Small contexts.
            <br />
            <span className="text-accent">Many agents.</span>
          </h2>
          <p className="max-w-[48ch] text-[15px] leading-relaxed text-muted">
            An agent that works the whole backlog drags every file it read into every later decision. I
            give each ticket its own agent, its own worktree and a fresh context, and run a few at a
            time. That&apos;s most of the spike in the terrain above.
          </p>
        </div>
        <div className="mt-14">
          <ContextDiagramStatic />
        </div>
        <Link
          href="/agents"
          className="mt-12 inline-block font-mono text-[12px] uppercase tracking-[0.08em] text-accent hover:text-ink"
        >
          → How tackle and tackle-board work
        </Link>
      </div>
    </section>
  );
}
