"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ExtensionPopup, PopupButton, ProgressStep } from "./ExtensionPopup";
import { FitScale } from "./FitScale";
import { BrowserFrame, EXAMPLE, FOUND, Hl, Label, Line, TIERS } from "./visuals";

// One application, start to finish, as an autoplaying loop: click Cover Me on
// a posting, the popup reads it, tailors the resume in the posting's words,
// then shows the ATS match. A single clock x (seconds, 0..LOOP) drives every
// layer, which derives its state from x (the Cover Me site's RunStory, with
// time in place of scroll). The server, and reduced motion, render x = FINAL.
const LOOP = 15;
const FINAL = 13;
const STAGE_W = 640;
const STAGE_H = 456;

// Beats, in seconds.
const PRESS = 1.6; // cursor clicks the toolbar icon
const READ = [2.4, 4.6] as const; // requirements light up and get sorted
const TAILOR = [5, 9.6] as const; // timer 0:03 → 0:28, resume rewritten
const RESULT = 9.8; // score
const OUT = 14.4; // everything fades back to the bare posting, then loops

// 0 before a, 1 after b, linear between.
const ramp = (x: number, a: number, b: number) => Math.min(1, Math.max(0, (x - a) / (b - a)));
const ease = (u: number) => 1 - Math.pow(1 - u, 3);

// The real run's clock (seconds) and the popup's four tailor steps
// (extension/src/lib/progress-steps.ts) with when each starts.
const RUN_SECONDS = 28;
const runSeconds = (x: number) => 3 + ramp(x, TAILOR[0], TAILOR[1]) * (RUN_SECONDS - 3);
const atRun = (s: number) => TAILOR[0] + ((s - 3) / (RUN_SECONDS - 3)) * (TAILOR[1] - TAILOR[0]);
const STEPS = [
  { at: 0, label: "Read the posting" },
  { at: 3, label: "Plan the changes" },
  { at: 7, label: "Rewrite your resume" },
  { at: 23, label: "Check and score" },
];
const BULLET_AT = [10, 13.4, 16.8].map(atRun);
const SKILLS_AT = atRun(20);

function stepState(i: number, t: number) {
  if (t >= (STEPS[i + 1]?.at ?? RUN_SECONDS)) return "done";
  return t >= STEPS[i].at ? "active" : "todo";
}

// The part being rewritten, shown next to the active step as the popup does.
function rewriteDetail(t: number) {
  if (t < 10) return "Summary";
  if (t < 20) return `Experience, ${Math.min(3, 1 + Math.floor((t - 10) / 3.4))} of 3`;
  return "Skills";
}

// Types `segments` out up to n characters, keeping segment boundaries.
function typed(segments: string[], n: number) {
  let left = Math.max(0, Math.round(n));
  return segments.map((s) => {
    const part = s.slice(0, left);
    left -= part.length;
    return part;
  });
}

// ── The clock ───────────────────────────────────────────────────────────────

const noop = () => () => {};

// Seconds into the loop. Runs only while the stage is on screen and resumes
// where it paused. Hydrates at FINAL (matching the server), then rests at 0
// until first seen; reduced motion stays on FINAL.
function useLoopClock() {
  const ref = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [x, setX] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      // Clamped so a background tab doesn't jump the story on return.
      if (last) elapsed.current += Math.min(0.1, (now - last) / 1000);
      last = now;
      setX(elapsed.current % LOOP);
      raf = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        last = 0;
        if (entry.isIntersecting) raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  return [ref, !hydrated || reduced ? FINAL : x] as const;
}

// ── Icons ───────────────────────────────────────────────────────────────────

function CheckGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BangGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden>
      <path d="M12 5v9M12 19v.5" />
    </svg>
  );
}

// ── Browser: posting, toolbar icon, cursor ──────────────────────────────────

function ToolbarIcon({ x }: { x: number }) {
  const press = ramp(x, PRESS, PRESS + 0.12) - ramp(x, PRESS + 0.12, PRESS + 0.26);
  const burst = ramp(x, PRESS + 0.06, PRESS + 0.6);
  const cursor = ease(ramp(x, 0.3, PRESS));
  const opened = x > PRESS + 0.1 && x < OUT + 0.3;
  return (
    <span
      className={`relative flex size-7 shrink-0 items-center justify-center rounded-[8px] ${opened ? "bg-white" : ""}`}
      style={{ scale: `${1 - press * 0.16}` }}
    >
      <Image src="/assets/coverme.png" width={18} height={18} alt="" className="rounded-[5px]" />
      {burst > 0 &&
        burst < 1 &&
        Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 -mt-[5px] -ml-[1.25px] h-[10px] w-[2.5px] rounded-[2px] bg-cm-brand"
            style={{
              opacity: 1 - burst,
              transform: `rotate(${i * 45 + 22.5}deg) translateY(${-14 - burst * 22}px) scaleY(${0.3 + burst * 0.7})`,
            }}
          />
        ))}
      {x < PRESS + 0.8 && (
        <svg
          className="absolute top-[calc(50%-2px)] left-[calc(50%-3px)] z-10"
          width="22"
          height="22"
          viewBox="0 0 20 20"
          style={{
            translate: `${(1 - cursor) * -280}px ${(1 - cursor) * 250}px`,
            opacity: ramp(x, 0.15, 0.4) * (1 - ramp(x, PRESS + 0.4, PRESS + 0.8)),
          }}
        >
          <path d="M3 2l13 7.2-5.6 1.4L8 16z" fill="#1E1B4B" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function PostingText({ lit }: { lit: number }) {
  return EXAMPLE.posting.map((line, li) => (
    <p key={li} className="text-[13px] leading-[1.75] text-cm-body">
      {line.map((s, si) => {
        if (typeof s === "string") return <span key={si}>{s}</span>;
        const sweep = Math.min(1, Math.max(0, lit - FOUND.indexOf(s.k)));
        const tint = EXAMPLE.niceToHave.includes(s.k) ? "#EEEEFF" : "#DCDCFE";
        return (
          <span
            key={si}
            className={`-mx-0.5 rounded-[4px] px-0.5 ${sweep >= 1 ? "font-medium text-cm-brand-ink" : ""}`}
            style={{
              backgroundImage: `linear-gradient(${tint}, ${tint})`,
              backgroundSize: `${sweep * 100}% 100%`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {s.text ?? s.k}
          </span>
        );
      })}
    </p>
  ));
}

// ── Popup bodies ────────────────────────────────────────────────────────────

function ReadBody({ found }: { found: number }) {
  const shown = FOUND.slice(0, found);
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex items-baseline justify-between text-[12px]">
        <span className="text-cm-ext-muted">{found === 0 ? "Reading the posting…" : "Requirements found"}</span>
        <span className="font-cm-mono text-[15px] text-cm-ext-text tabular-nums">{found}</span>
      </div>
      {TIERS.map((t) => (
        <div key={t.label} className="flex min-h-[46px] flex-col gap-1.5">
          <div className="font-cm-mono text-[9.5px] tracking-[0.08em] text-cm-ext-muted uppercase">{t.label}</div>
          <div className="flex flex-wrap gap-1">
            {shown
              .filter((k) => t.keywords.includes(k))
              .map((k) => (
                <span key={k} className="animate-cm-fade-up rounded-[6px] bg-cm-ext-elevated px-1.5 py-0.5 text-[10.5px] text-cm-ext-text">
                  {k}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TailorBody({ t }: { t: number }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-cm-ext-muted">Tailoring your resume</span>
        <span className="font-cm-mono text-[15px] tabular-nums">0:{String(Math.floor(t)).padStart(2, "0")}</span>
      </div>
      <div className="h-1.5 rounded-full bg-cm-ext-elevated">
        <div className="h-1.5 rounded-full bg-cm-brand" style={{ width: `${(t / RUN_SECONDS) * 100}%` }} />
      </div>
      <ul className="flex flex-col gap-2">
        {STEPS.map((s, i) => {
          const state = stepState(i, t);
          return (
            <ProgressStep key={s.label} state={state}>
              {s.label}
              {i === 2 && state === "active" && <span className="ml-1.5 font-normal text-cm-ext-muted">{rewriteDetail(t)}</span>}
            </ProgressStep>
          );
        })}
      </ul>
    </div>
  );
}

// The extension's ATS ring (popup/components/ScoreRing.tsx): fills to the score.
function ScoreRing({ value, size }: { value: number; size: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const filled = (c * value) / 100;
  return (
    <svg viewBox="0 0 132 132" width={size} height={size} className="shrink-0" aria-hidden>
      <circle cx="66" cy="66" r={r} fill="none" stroke="var(--color-cm-ext-elevated)" strokeWidth="10" />
      <circle
        cx="66"
        cy="66"
        r={r}
        fill="none"
        stroke="var(--color-cm-brand)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c - filled}`}
        transform="rotate(-90 66 66)"
      />
      <text x="66" y="70" textAnchor="middle" fill="var(--color-cm-ext-text)" fontSize="36" fontWeight="600">
        {Math.round(value)}
      </text>
      <text x="66" y="92" textAnchor="middle" fill="var(--color-cm-ext-muted)" fontSize="10" letterSpacing="1.5" className="font-cm-mono">
        ATS MATCH
      </text>
    </svg>
  );
}

// The extension's tailor result: job, ring, and the posting's missing keywords.
function ResultBody({ x }: { x: number }) {
  const fill = ease(ramp(x, RESULT + 0.2, RESULT + 1)); // GROW_MS 800 in the extension
  const chips = ramp(x, RESULT + 0.9, RESULT + 1.2);
  return (
    <div className="px-4 py-4">
      <div className="mb-2.5">
        <div className="text-[13px] font-semibold text-cm-ext-text">{EXAMPLE.role}</div>
        <div className="mt-px text-[11px] text-cm-ext-text-2">{EXAMPLE.company}</div>
      </div>
      <div className="flex items-start gap-3.5 rounded-[12px] border border-cm-ext-border bg-cm-ext-surface p-3.5">
        <ScoreRing value={EXAMPLE.score * fill} size={88} />
        <div className="min-w-0 flex-1 pt-1" style={{ opacity: chips }}>
          <div className="mb-1.5 font-cm-mono text-[10px] tracking-[1.2px] text-cm-ext-muted uppercase">Missing</div>
          <ul className="flex flex-wrap gap-1.5">
            {EXAMPLE.gaps.map((g) => (
              <li key={g} className="rounded-full bg-cm-ext-gap-bg px-[9px] py-[3px] text-[11px] text-cm-ext-gap-fg">
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── The white card over the posting: the resume, then the breakdown ────────

function Bullet({ x, at, before, after }: { x: number; at: number; before: string; after: string[] }) {
  const u = ramp(x, at, at + 0.6);
  if (u < 0.45) {
    return (
      <p className="text-[12.5px] leading-[1.55] text-cm-subtle" style={{ opacity: 1 - ramp(u, 0.3, 0.45) }}>
        <span
          className="bg-no-repeat"
          style={{ backgroundImage: "linear-gradient(#6B635D,#6B635D)", backgroundSize: `${ramp(u, 0, 0.3) * 100}% 1.5px`, backgroundPosition: "0 58%" }}
        >
          {before}
        </span>
      </p>
    );
  }
  const out = typed(after, ramp(u, 0.45, 1) * after.join("").length);
  return (
    <p className="text-[12.5px] leading-[1.55] text-cm-body">
      <span>{out[0]}</span>
      {out[1] && <Hl className="font-medium">{out[1]}</Hl>}
      <span>{out[2]}</span>
      {u < 1 && <span className="ml-px inline-block h-[13px] w-[2px] translate-y-[2px] bg-cm-brand" />}
    </p>
  );
}

const CARD = "absolute top-4 left-5 flex w-[318px] flex-col rounded-[16px] bg-white shadow-[0_30px_70px_-30px_rgba(30,27,75,0.45)]";

function ResumeCard({ x, style }: { x: number; style: CSSProperties }) {
  // Old line fades out fully before the chips fade in, so the two never overlap.
  const skillsOut = ramp(x, SKILLS_AT, SKILLS_AT + 0.25);
  const skills = ramp(x, SKILLS_AT + 0.25, SKILLS_AT + 0.5);
  return (
    <div className={`${CARD} gap-2.5 p-5`} style={style}>
      <div className="flex items-center justify-between">
        <Label>Your resume</Label>
        <span
          className="rounded-full bg-cm-brand-tint px-2.5 py-1 text-[11px] text-cm-brand-ink"
          style={{ opacity: ramp(x, atRun(23), atRun(23) + 0.2) }}
        >
          Tailored for {EXAMPLE.company}
        </span>
      </div>
      <div>
        <div className="text-[16px] font-semibold text-cm-ink">{EXAMPLE.candidate}</div>
        <div className="text-[11.5px] text-cm-subtle">Marketing Lead · Brightline</div>
      </div>
      <div className="mt-1 text-[10.5px] font-semibold tracking-[0.06em] text-cm-ink-2 uppercase">Experience</div>
      {EXAMPLE.bullets.map((b, i) => (
        <Bullet key={b.before} x={x} at={BULLET_AT[i]} before={b.before} after={b.after} />
      ))}
      <div className="mt-1 text-[10.5px] font-semibold tracking-[0.06em] text-cm-ink-2 uppercase">Skills</div>
      <div className="relative min-h-[44px]">
        <p className="absolute text-[12.5px] text-cm-subtle" style={{ opacity: 1 - skillsOut }}>
          {EXAMPLE.skillsBefore}
        </p>
        <div className="flex flex-wrap gap-1.5" style={{ opacity: skills }}>
          {EXAMPLE.skillsAfter.map((s) => (
            <Hl key={s} className="text-[11.5px]">
              {s}
            </Hl>
          ))}
        </div>
      </div>
    </div>
  );
}

const TIER_ORDER = TIERS.flatMap((t) => t.keywords);

function Mark({ gap, on }: { gap: boolean; on: boolean }) {
  const look = !on ? "scale-75 border border-dashed border-cm-line" : gap ? "bg-cm-gap" : "bg-cm-brand";
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] text-white transition-all duration-300 ${look}`}>
      {on && (gap ? <BangGlyph size={12} /> : <CheckGlyph size={11} />)}
    </span>
  );
}

// The posting's requirements against the tailored resume (the site's score
// chapter): each tier checks off, the missing one is flagged.
function BreakdownCard({ x, style }: { x: number; style: CSSProperties }) {
  const checked = Math.floor(ramp(x, RESULT + 0.2, RESULT + 1.3) * FOUND.length + 1e-6);
  return (
    <div className={`${CARD} gap-4 p-5`} style={style}>
      <Label>Posting vs. your resume</Label>
      {TIERS.map((t) => (
        <div key={t.label} className="flex flex-col gap-2">
          <div className="flex justify-between font-cm-mono text-[10px] tracking-[0.08em] text-cm-subtle uppercase">
            <span>{t.label}</span>
            <span>{t.points} pts</span>
          </div>
          {t.keywords.map((k) => {
            const on = TIER_ORDER.indexOf(k) < checked;
            const gap = EXAMPLE.gaps.includes(k);
            return (
              <div key={k} className="flex items-center gap-2.5 text-[13px]">
                <Mark gap={gap} on={on} />
                <span className={!on ? "text-cm-subtle" : gap ? "font-medium text-cm-gap-ink" : "text-cm-body"}>{k}</span>
                {on && gap && <span className="ml-auto text-[11px] font-medium text-cm-gap-ink">Not on resume</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Stage ───────────────────────────────────────────────────────────────────

function Stage({ x }: { x: number }) {
  const out = 1 - ramp(x, OUT, LOOP); // the reset back to the bare posting
  const open = ease(ramp(x, PRESS + 0.1, PRESS + 0.6)) * out;
  const lit = ramp(x, READ[0], READ[1]) * FOUND.length * out;
  const found = Math.floor(ramp(x, READ[0], READ[1]) * FOUND.length + 1e-6);
  const t = runSeconds(x);
  const card = ease(ramp(x, TAILOR[0], TAILOR[0] + 0.5)) * out;
  const swap = ramp(x, RESULT, RESULT + 0.4); // resume card → breakdown card
  const status = x < READ[1] ? "Reading…" : x < TAILOR[0] ? "Posting read" : x < RESULT ? "Tailoring…" : `Done in 0:${RUN_SECONDS}`;
  return (
    <BrowserFrame url="linkedin.com/jobs/view/3982614057" toolbar={<ToolbarIcon x={x} />} className="h-full">
      <div className="flex flex-col gap-3 p-6 pr-[300px]" style={{ opacity: 1 - card * 0.45 }}>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[11px] bg-cm-ink text-[18px] font-semibold text-white">N</div>
          <div>
            <div className="text-[18px] font-semibold tracking-[-0.02em] text-cm-ink">{EXAMPLE.role}</div>
            <div className="text-[12px] text-cm-subtle">{EXAMPLE.company} · Remote · Full-time</div>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-[#0A66C2] px-4 py-1.5 text-[12px] font-semibold text-white">Easy Apply</span>
          <span className="rounded-full border border-[#0A66C2] px-4 py-1.5 text-[12px] font-semibold text-[#0A66C2]">Save</span>
        </div>
        <div className="mt-2 text-[12px] font-semibold text-cm-ink-2">About the job</div>
        <PostingText lit={lit} />
        <Line w="92%" className="mt-2" />
        <Line w="84%" />
        <Line w="66%" />
      </div>

      {card > 0 && swap < 1 && (
        <ResumeCard x={x} style={{ opacity: card * (1 - swap), transform: `translateY(${(1 - card) * 24}px)` }} />
      )}
      {swap > 0 && <BreakdownCard x={x} style={{ opacity: swap * out, transform: `translateY(${(1 - swap) * 16}px)` }} />}

      {/* The popup grows out of the toolbar icon. */}
      <div className="absolute top-2 right-3 w-[282px] origin-top-right" style={{ opacity: open, scale: `${0.85 + open * 0.15}` }}>
        <ExtensionPopup
          status={status}
          footer={
            x >= RESULT ? (
              <>
                <PopupButton primary>Download</PopupButton>
                <PopupButton>Edit</PopupButton>
                <span className="px-2 py-2.5 text-[12px] font-semibold text-cm-ext-muted">New</span>
              </>
            ) : undefined
          }
        >
          {x < TAILOR[0] ? <ReadBody found={found} /> : x < RESULT ? <TailorBody t={t} /> : <ResultBody x={x} />}
        </ExtensionPopup>
      </div>
    </BrowserFrame>
  );
}

export default function CoverMeProduct() {
  const [ref, x] = useLoopClock();
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="sr-only">
        Example: on a {EXAMPLE.company} {EXAMPLE.role} posting, Cover Me finds 8 requirements, rewrites the resume in the
        posting&apos;s words, and scores it {EXAMPLE.score} out of 100 with HubSpot as the one missing keyword.
      </p>
      <div ref={ref} inert aria-hidden="true" className="w-full max-w-[640px]">
        <FitScale width={STAGE_W} height={STAGE_H}>
          <Stage x={x} />
        </FitScale>
      </div>
      <p className="text-center font-cm-mono text-[11px] text-balance text-cm-subtle">
        Shown sped up. A real run takes about 30 seconds.
      </p>
    </div>
  );
}
