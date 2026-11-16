"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Illustrative sample text. Each step lights one group of posting keywords and
// rewrites the matching resume line: same experience, the posting's wording.
const STEPS = [
  {
    keys: ["TypeScript", "React"],
    before: "Built UI components for internal tools.",
    after: ["Built a ", "React", " + ", "TypeScript", " component library for internal tools."],
  },
  {
    keys: ["accessibility"],
    before: "Made the app work with keyboards and screen readers.",
    after: ["Led ", "accessibility", " work: keyboard navigation and screen-reader support."],
  },
  {
    keys: ["performance"],
    before: "Sped up slow dashboard pages by splitting code.",
    after: ["Improved dashboard ", "performance", " by profiling and code-splitting slow pages."],
  },
  {
    keys: ["component architecture"],
    before: "Worked with designers on new screens.",
    after: ["Partnered with design on ", "component architecture", " for new screens."],
  },
];
const SCORES = [61, 69, 77, 85, 92];
const GAPS = ["TypeScript", "Accessibility", "Performance"];
const POSTING: (string | number)[] = [
  "We're hiring a Senior Frontend Engineer to grow our design system in ",
  0, " and ", 0, ". You'll own ", 1, " across the product, ship ", 2,
  " improvements, and partner with design on ", 3, ".",
];
const STEP_MS = 1700;
const HOLD_MS = 3200;

export default function CoverMeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0); // rewrites completed, 0..4
  const done = reduced ? STEPS.length : step;

  useEffect(() => {
    if (!inView || reduced) return;
    const t = setTimeout(
      () => setStep((s) => (s >= STEPS.length ? 0 : s + 1)),
      step >= STEPS.length ? HOLD_MS : step === 0 ? 900 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [inView, reduced, step]);

  // Keyword occurrences consumed left to right so "TypeScript" and "React" map to step 0's two keys.
  const used: Record<number, number> = {};
  return (
    <div ref={ref} className="relative">
      <p className="sr-only">
        Animation: Cover Me highlights a job posting&apos;s keywords and rewrites matching resume lines in
        the posting&apos;s wording without adding experience, raising the match score from 61 to 92.
      </p>
      <div aria-hidden="true" className="grid md:grid-cols-2">
        <div className="border-b border-[#e8e3da] p-6 md:border-b-0 md:border-r md:p-8">
          <p className="label">Job posting — Northwind · Senior Frontend Engineer</p>
          <p className="mt-5 text-[15px] leading-[1.9] text-[#6d6962] md:text-base">
            {POSTING.map((part, i) => {
              if (typeof part === "string") return <span key={i}>{part}</span>;
              const n = (used[part] = (used[part] ?? -1) + 1);
              const word = STEPS[part].keys[n] ?? STEPS[part].keys[0];
              const lit = part < done;
              return (
                <span
                  key={i}
                  className="rounded px-0.5 transition-colors duration-500"
                  style={{
                    color: lit ? "#ffffff" : "#1d1c1a",
                    background: lit ? "#5b5bf0" : "transparent",
                    boxShadow: lit ? "none" : "inset 0 -1px 0 #cfc8bb",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        <div className="p-6 md:p-8">
          <p className="label">Your resume — tailored, nothing invented</p>
          <ol className="mt-5 space-y-3">
            {STEPS.map((s, i) => {
              const rewritten = i < done;
              return (
                <li key={i} className="grid grid-cols-[22px_1fr] text-[14px] leading-snug md:text-[15px]">
                  <span className="font-mono text-[11px] leading-[1.6] text-[#a8a29a]">0{i + 1}</span>
                  <span className="grid">
                    <span
                      className="col-start-1 row-start-1 text-[#6d6962] line-through decoration-[#a8a29a] transition-opacity duration-300"
                      style={{ opacity: rewritten ? 0 : 1 }}
                    >
                      {s.before}
                    </span>
                    <span
                      className="col-start-1 row-start-1 transition-opacity duration-500"
                      style={{ opacity: rewritten ? 1 : 0, transitionDelay: rewritten ? "300ms" : "0ms" }}
                    >
                      {s.after.map((t, j) => (
                        <span key={j} className={s.keys.includes(t) ? "text-[#5b5bf0]" : "text-[#1d1c1a]"}>
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div aria-hidden="true" className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e8e3da] px-6 py-4 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#6d6962]">
          Match{" "}
          <span className="ml-2 font-bold align-middle text-[34px] text-[#5b5bf0] tabular-nums">{SCORES[done]}</span>
          <span className="text-[#a8a29a]">/100</span>
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em]">
          {GAPS.map((g, i) => (
            <li key={g} className={i < done ? "text-[#1d1c1a]" : "text-[#a8a29a]"}>
              {i < done ? "✓" : "○"} {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
