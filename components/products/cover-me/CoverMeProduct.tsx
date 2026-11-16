"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ExtensionPopup, PopupButton, ProgressStep } from "./ExtensionPopup";
import { FitScale } from "./FitScale";
import { EXAMPLE, LetterDoc, ResumeDoc } from "./visuals";

// A replay of the Cover Me extension popup tailoring a resume. A real run takes
// about 30 s; this plays one in a few seconds (the caption says so). The server
// renders the finished state, which is also what reduced-motion visitors see.
const RUN_SECONDS = 28;
// The popup's four tailor steps (extension/src/lib/progress-steps.ts).
const STEPS = [
  { at: 0, label: "Read the posting" },
  { at: 3, label: "Plan the changes" },
  { at: 7, label: "Rewrite your resume" },
  { at: 23, label: "Check and score" },
];

const noop = () => () => {};

// Counts 0 → `to` (ease-out cubic) the first time the element scrolls into view.
// The server (and hydration) render `to`, so no-JS and reduced-motion visitors
// get the finished frame; after hydration it rests at 0 until seen.
function useCountUp<T extends HTMLElement>(to: number, duration: number) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const [progress, setProgress] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          setProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, duration]);
  const value = !hydrated || reduced ? to : to * (progress ?? 0);
  return [ref, value] as const;
}

// The part being rewritten, shown next to the active step as the popup does.
function rewriteDetail(t: number) {
  if (t < 10) return "Summary";
  if (t < 20) return `Experience, ${Math.min(3, 1 + Math.floor((t - 10) / 3.4))} of 3`;
  return "Skills";
}

function stepState(i: number, t: number) {
  const next = STEPS[i + 1]?.at ?? RUN_SECONDS;
  if (t >= next) return "done";
  if (t >= STEPS[i].at) return "active";
  return "todo";
}

function Run() {
  const [ref, value] = useCountUp<HTMLDivElement>(RUN_SECONDS, 5200);
  const t = Math.round(value);
  const done = t >= RUN_SECONDS;
  return (
    <div ref={ref} className="relative h-full w-full">
      <LetterDoc className="absolute top-6 left-0 w-[250px] -rotate-[7deg] opacity-95" />
      <ResumeDoc className="absolute top-0 right-0 w-[270px] rotate-[6deg]" />
      <ExtensionPopup
        status={done ? `Done in 0:${RUN_SECONDS}` : "Tailoring…"}
        className="absolute bottom-0 left-1/2 w-[300px] -translate-x-1/2"
        footer={
          <>
            <PopupButton primary>Download resume</PopupButton>
            <PopupButton>Cover letter</PopupButton>
          </>
        }
      >
        <div className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] text-cm-ext-muted">{done ? "Resume tailored" : "Tailoring your resume"}</span>
            <span className="font-cm-mono text-[15px] tabular-nums">0:{String(t).padStart(2, "0")}</span>
          </div>
          <div className="h-1.5 rounded-full bg-cm-ext-elevated">
            <div className="h-1.5 rounded-full bg-cm-brand" style={{ width: `${(value / RUN_SECONDS) * 100}%` }} />
          </div>
          <ul className="flex flex-col gap-2">
            {STEPS.map((s, i) => {
              const state = stepState(i, t);
              return (
                <ProgressStep key={s.label} state={state}>
                  {s.label}
                  {s.label === "Rewrite your resume" && state === "active" && (
                    <span className="ml-1.5 font-normal text-cm-ext-muted">{rewriteDetail(t)}</span>
                  )}
                </ProgressStep>
              );
            })}
          </ul>
          <div className="flex items-center justify-between rounded-[10px] bg-cm-ext-elevated px-3 py-2 text-[12px]">
            <span className="text-cm-ext-muted">ATS match</span>
            <span className={done ? "font-semibold text-cm-ext-text" : "text-cm-ext-muted"}>
              {done ? `${EXAMPLE.score}%` : "Scoring…"}
            </span>
          </div>
        </div>
      </ExtensionPopup>
    </div>
  );
}

export default function CoverMeProduct() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div inert aria-hidden="true" className="w-full">
        <FitScale width={480} height={440}>
          <Run />
        </FitScale>
      </div>
      <p className="text-center font-cm-mono text-[11px] text-balance text-cm-subtle">
        Shown sped up. A real run takes about 30 seconds.
      </p>
    </div>
  );
}
