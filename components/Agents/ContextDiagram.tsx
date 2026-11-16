"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TICKETS = 9;
const SLOTS = 3;
const INK = "rgba(236,235,230,0.85)";
const DIM = "rgba(236,235,230,0.32)";
const RULE = "rgba(236,235,230,0.18)";
const ACCENT = "var(--accent)";

function Mono({ x, y, children, fill = DIM, size = 11, anchor = "start" }: {
  x: number; y: number; children: React.ReactNode; fill?: string; size?: number; anchor?: "start" | "end" | "middle";
}) {
  return (
    <text x={x} y={y} fill={fill} fontSize={size} textAnchor={anchor} className="font-mono" letterSpacing="0.06em">
      {children}
    </text>
  );
}

/** One agent working the whole backlog: context only grows, quality sags. */
function SingleLane({ p }: { p: number }) {
  const done = Math.min(TICKETS, p * TICKETS);
  const fillAt = (n: number) => Math.min(1, 0.08 + n * 0.103);
  const fill = fillAt(done);
  const quality = (n: number) => 1 - 0.75 * fillAt(n) ** 2.2;
  const pts = Array.from({ length: Math.floor(done) + 1 }, (_, i) => i).map(
    (i) => `${20 + (i / TICKETS) * 400},${370 - quality(i) * 100}`,
  );
  return (
    <svg viewBox="0 0 440 420" className="block h-auto w-full" role="img"
      aria-label="One agent working nine tickets: its context window fills to nearly 100% and output quality drops.">
      <Mono x={20} y={22} fill={INK}>ONE AGENT · WHOLE BACKLOG</Mono>
      <rect x={20} y={40} width={400} height={56} fill="var(--bg-2)" stroke={RULE} />
      <Mono x={36} y={64} fill={INK} size={12}>AGENT</Mono>
      <Mono x={36} y={82}>every ticket, file and dead end, in one context</Mono>

      <Mono x={20} y={130}>CONTEXT WINDOW</Mono>
      <Mono x={420} y={130} anchor="end" fill={fill > 0.7 ? ACCENT : INK}>{Math.round(fill * 100)}%</Mono>
      <rect x={20} y={140} width={400} height={18} fill="none" stroke={RULE} />
      <rect x={21} y={141} width={398 * fill} height={16} fill={fill > 0.7 ? ACCENT : DIM} />

      <Mono x={20} y={194}>TICKETS READ</Mono>
      {Array.from({ length: TICKETS }, (_, i) => (
        <rect key={i} x={20 + i * 45} y={204} width={38} height={14}
          fill={i < done ? DIM : "none"} stroke={RULE} />
      ))}

      <Mono x={20} y={252}>OUTPUT QUALITY PER TICKET</Mono>
      <line x1={20} x2={420} y1={370} y2={370} stroke={RULE} />
      <line x1={20} x2={420} y1={270} y2={270} stroke={RULE} strokeDasharray="2 4" />
      <polyline points={pts.join(" ")} fill="none" stroke={ACCENT} strokeWidth={2} />
      <Mono x={20} y={396}>scope creeps · early details lost · quality drops</Mono>
    </svg>
  );
}

/** tackle-board: tickets flow into N slots; each agent starts fresh and stays small. */
function BoardLane({ p }: { p: number }) {
  const per = TICKETS / SLOTS;
  const started = Math.min(TICKETS, Math.floor(p * per) * SLOTS + SLOTS);
  return (
    <svg viewBox="0 0 480 446" className="block h-auto w-full" role="img"
      aria-label="tackle-board: nine tickets flow into three slots. Each agent's context stays under a quarter full and resets per ticket; each finished ticket becomes a pull request.">
      <Mono x={0} y={22} fill={INK}>TACKLE-BOARD · N = 3</Mono>

      <Mono x={0} y={56}>BOARD</Mono>
      {Array.from({ length: TICKETS }, (_, i) => {
        const left = i >= started;
        return (
          <g key={i} opacity={left ? 1 : 0.18}>
            <rect x={0} y={66 + i * 36} width={110} height={28} fill="var(--bg-2)" stroke={RULE} />
            <Mono x={10} y={84 + i * 36} fill={left ? INK : DIM}>#{120 + i}</Mono>
          </g>
        );
      })}

      {Array.from({ length: SLOTS }, (_, s) => {
        const sp = Math.min(per, p * per);
        const current = Math.min(per - 1, Math.floor(sp));
        const frac = p >= 1 ? 1 : sp - Math.floor(sp);
        const fill = 0.06 + 0.18 * frac;
        const prs = p >= 1 ? per : Math.floor(sp);
        const y = 48 + s * 126;
        return (
          <g key={s}>
            <path d={`M110,${80 + s * 120} H135 V${y + 40} H150`} fill="none" stroke={RULE} />
            <rect x={150} y={y} width={320} height={108} fill="var(--bg-2)" stroke={RULE} />
            <Mono x={166} y={y + 22} fill={INK}>SLOT {s + 1} · /tackle #{120 + current * SLOTS + s}</Mono>
            <Mono x={166} y={y + 46}>CONTEXT</Mono>
            <Mono x={454} y={y + 46} anchor="end" fill={INK}>{Math.round(fill * 100)}%</Mono>
            <rect x={166} y={y + 54} width={288} height={12} fill="none" stroke={RULE} />
            <rect x={167} y={y + 55} width={286 * fill} height={10} fill={INK} />
            {Array.from({ length: prs }, (_, j) => (
              <g key={j}>
                <rect x={166 + j * 52} y={y + 78} width={44} height={18} fill="none" stroke={ACCENT} />
                <Mono x={188 + j * 52} y={y + 91} fill={ACCENT} size={10} anchor="middle">PR</Mono>
              </g>
            ))}
          </g>
        );
      })}
      <Mono x={0} y={438}>own worktree per ticket · out of scope → new ticket</Mono>
    </svg>
  );
}

export function ContextDiagramStatic() {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      <SingleLane p={1} />
      <BoardLane p={1} />
    </div>
  );
}

/** Scroll-driven: progress runs 0 → 1 as the figure crosses the viewport. */
export default function ContextDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.3"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(v));
  const shown = reduced ? 1 : p;

  return (
    <div ref={ref} className="grid gap-10 md:grid-cols-2 md:gap-16">
      <SingleLane p={shown} />
      <BoardLane p={shown} />
    </div>
  );
}
