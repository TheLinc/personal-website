import type { ReactNode } from "react";

// Example data for the Cover Me visuals (placeholder names, illustrative numbers).
export const EXAMPLE = {
  company: "Northwind",
  candidate: "Alex Rivera",
  // Every rewrite keeps the facts and only borrows the posting's words.
  bullets: [
    ["Owned ", "campaign strategy", " for email and social, growing qualified leads 38%"],
    ["Owned a $1.2M paid media ", "budget", " across four channels"],
    ["Grew organic traffic 64% with an ", "SEO", " content program"],
  ] as [string, string, string][],
  letterOpening:
    "Your posting asks for someone who can grow demand without growing the budget. At Brightline I grew qualified leads 38% on a flat spend…",
  score: 86,
};

const CARD = "flex flex-col gap-2.5 rounded-[16px] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(30,27,75,0.35)]";

function Line({ w }: { w: string }) {
  return <div className="h-[7px] rounded-full bg-[#EFEDEA]" style={{ width: w }} />;
}

function Label({ children }: { children: ReactNode }) {
  return <div className="font-cm-mono text-[10.5px] tracking-[0.08em] text-cm-subtle uppercase">{children}</div>;
}

export function ResumeDoc({ className = "" }: { className?: string }) {
  return (
    <div className={`${CARD} ${className}`}>
      <div className="flex items-center justify-between">
        <Label>Your resume</Label>
        <span className="rounded-full bg-cm-brand-tint px-2.5 py-1 text-[11px] text-cm-brand-ink">
          Tailored for {EXAMPLE.company}
        </span>
      </div>
      <div className="text-[16px] font-semibold text-cm-ink">{EXAMPLE.candidate}</div>
      <Line w="55%" />
      <div className="mt-2 text-[11px] font-semibold text-cm-ink-2">Experience</div>
      {EXAMPLE.bullets.map(([a, k, b]) => (
        <p key={k} className="text-[12px] leading-[1.55] text-cm-body">
          {a}
          <span className="rounded bg-cm-brand-tint px-1 text-cm-brand-ink">{k}</span>
          {b}
        </p>
      ))}
      <div className="mt-1 flex flex-col gap-2">
        <Line w="92%" />
        <Line w="76%" />
      </div>
    </div>
  );
}

export function LetterDoc({ className = "" }: { className?: string }) {
  return (
    <div className={`${CARD} ${className}`}>
      <Label>Cover letter</Label>
      <div className="text-[13px] font-semibold text-cm-ink">Dear {EXAMPLE.company} team,</div>
      <p className="text-[12px] leading-[1.6] text-cm-body">{EXAMPLE.letterOpening}</p>
      <div className="flex flex-col gap-2">
        <Line w="96%" />
        <Line w="88%" />
        <Line w="70%" />
      </div>
    </div>
  );
}
