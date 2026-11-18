import type { ReactNode } from "react";

// The lstack rules, each with a one-glance line drawing. Classes: r/g/b = red/green/blue ink,
// f = paper fill (hides lines behind), d2/d3 = draws in second/third.
export type Rule = { title: string; text: string; art: ReactNode };

const P = (d: string, cls = "") => <path pathLength={1} className={`i ${cls}`} d={d} />;
const Rect = (x: number, y: number, w: number, h: number, rx: number, cls = "") => (
  <rect pathLength={1} className={`i ${cls}`} x={x} y={y} width={w} height={h} rx={rx} />
);

export const RULES: Rule[] = [
  {
    title: "Agree first",
    text: "The agent questions me until the goal is clear. Ambiguity kills productivity.",
    art: (
      <>
        {P("M34 18H86a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H50l-14 12v-12h-2a14 14 0 0 1-14-14V32a14 14 0 0 1 14-14Z")}
        {P("M53 36a7 7 0 1 1 9 6.5c-2 .8-2 2.5-2 5")}
        {P("M60 55v.5")}
        {P("M112 46H164a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14h-2v12l-14-12H112a14 14 0 0 1-14-14V60a14 14 0 0 1 14-14Z", "f d2")}
        {P("M126 70l8 8 16-16", "g d3")}
      </>
    ),
  },
  {
    title: "Split the work",
    text: "Tasks that don't depend on each other run at the same time.",
    art: (
      <>
        {Rect(12, 50, 40, 30, 6)}
        {P("M52 65C68 65 66 30 80 30M52 65C68 65 66 100 80 100", "d2")}
        {Rect(80, 16, 40, 28, 6, "b d2")}
        {P("M89 27h22M89 34h14", "b d3")}
        {Rect(80, 86, 40, 28, 6, "b d2")}
        {P("M89 97h22M89 104h14", "b d3")}
        {P("M120 30C134 30 132 65 148 65M120 100C134 100 132 65 148 65", "d3")}
        {Rect(148, 50, 40, 30, 6, "d3")}
      </>
    ),
  },
  {
    title: "Test first",
    text: "Write a test that fails, then the code that makes it pass.",
    art: (
      <>
        {Rect(22, 38, 54, 54, 10)}
        {P("M38 54l22 22M60 54L38 76", "r")}
        {P("M88 65h24M104 57l8 8-8 8", "d2")}
        {Rect(124, 38, 54, 54, 10, "d2")}
        {P("M138 66l9 9 18-19", "g d3")}
      </>
    ),
  },
  {
    title: "Less code",
    text: "Lean code and no agent comments. They go stale; the code doesn't.",
    art: (
      <>
        {Rect(22, 12, 58, 106, 8)}
        {P("M32 28h38M32 40h28M32 52h38M32 64h20M32 76h34M32 88h26M32 100h36", "d2")}
        {P("M92 65h22M106 57l8 8-8 8", "d2")}
        {Rect(126, 40, 58, 50, 8, "d3")}
        {P("M136 56h38M136 68h26", "g d3")}
      </>
    ),
  },
  {
    title: "Fresh eyes",
    text: "A second agent that didn't write the code reviews it until it's clean.",
    art: (
      <>
        {Rect(30, 14, 80, 102, 8)}
        {P("M42 32h52M42 46h40M42 60h56M42 74h30M42 88h46")}
        <circle pathLength={1} className="i f d2" cx={124} cy={68} r={26} />
        {P("M112 68h22", "r d3")}
        {P("M143 87l26 26", "d3 thick")}
      </>
    ),
  },
  {
    title: "Stay focused",
    text: "Bugs and side quests become new tickets, so each agent's memory stays small.",
    art: (
      <>
        {Rect(18, 22, 88, 86, 10)}
        {P("M32 44h56M32 58h40M32 72h50")}
        <path className="i dash" d="M108 50C122 50 126 36 140 36M108 80C122 80 126 94 140 94" />
        {Rect(140, 20, 44, 32, 6, "b d3")}
        {P("M162 29v14M155 36h14", "b d3")}
        {Rect(140, 78, 44, 32, 6, "b d3")}
        {P("M162 87v14M155 94h14", "b d3")}
      </>
    ),
  },
  {
    title: "Show proof",
    text: "Nothing is done without a screenshot or video of it working.",
    art: (
      <>
        {Rect(22, 16, 150, 96, 10)}
        {P("M22 34h150")}
        {P("M86 54v40l32-20Z", "d2")}
        <circle pathLength={1} className="i f d3" cx={170} cy={108} r={15} />
        {P("M163 108l5 5 9-10", "g d3")}
      </>
    ),
  },
  {
    title: "Learn once",
    text: "Every correction I make becomes an automatic check.",
    art: (
      <>
        {P("M30 32H74a12 12 0 0 1 12 12v18a12 12 0 0 1-12 12H48l-12 10V74h-6a12 12 0 0 1-12-12V44a12 12 0 0 1 12-12Z")}
        {P("M44 46l14 14M58 46L44 60", "r")}
        {P("M96 65h20M108 57l8 8-8 8", "d2")}
        {P("M156 26l28 10v24c0 20-13 32-28 38-15-6-28-18-28-38V36Z", "d3")}
        {P("M144 62l8 8 16-17", "g d3")}
      </>
    ),
  },
];
