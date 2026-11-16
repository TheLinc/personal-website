"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { crew, crewById, type CrewId } from "./crew";
import { CrewDesks, deskCentre, type DeskStatus } from "./CrewDesks";
import { CrewFace } from "./CrewFace";
import "./crew.css";

const LINES: Record<CrewId, string> = {
  clawd: "PR #142 is up for review.",
  bit: "Tests pass. 1,104 of 1,104.",
  terminal: "Build finished in 38 s.",
  block: "Filed a ticket for the flaky upload test.",
  loop: "Worktree cleaned up. Next ticket?",
};
const STEP_MS = 2400;

/** At step k: agent k just finished and speaks, the next three are working, the last is idle. */
function desksAt(k: number): Record<CrewId, DeskStatus> {
  const out = {} as Record<CrewId, DeskStatus>;
  crew.forEach((c, i) => {
    const offset = (i - (k % crew.length) + crew.length) % crew.length;
    out[c.id] = offset === 0 ? "done" : offset <= 3 ? "working" : "idle";
  });
  return out;
}

export default function CrewScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [k, setK] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setInterval(() => setK((n) => n + 1), STEP_MS);
    return () => clearInterval(t);
  }, [inView, reduced]);

  const speaker = crew[k % crew.length];
  return (
    <div ref={ref} className="px-6 pb-6 pt-10 md:px-12 md:pt-14">
      <p className="sr-only">
        Animation: Open Room&apos;s five agents, Clawd, Bit, Terminal, Block and Loop, working at their desks.
        As each finishes it turns around and reports back by voice.
      </p>
      <div aria-hidden="true">
        <CrewDesks desks={desksAt(k)} glancing={speaker.id} className="block h-auto w-full" />
        <div className="relative mt-3 h-4">
          {crew.map((c) => (
            <span
              key={c.id}
              className="absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.08em] md:text-[11px]"
              style={{ left: `${deskCentre[c.id] * 100}%`, color: c.id === speaker.id ? c.color : "var(--faint)" }}
            >
              {c.name}
            </span>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <p
            key={k}
            className="flex items-center gap-3 rounded-full border border-rule bg-bg px-4 py-2 font-mono text-[12px] text-ink"
            style={{ animation: reduced ? undefined : "crew-pill 400ms ease-out" }}
          >
            <CrewFace id={speaker.id} size={18} />
            <span style={{ color: crewById[speaker.id].color }}>{speaker.name}</span>
            <span className="text-muted">{LINES[speaker.id]}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
