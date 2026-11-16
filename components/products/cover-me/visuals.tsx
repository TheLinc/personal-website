import type { ReactNode } from "react";

// Example data for the Cover Me visuals (placeholder names, illustrative
// numbers), from the Cover Me site's landing visuals.
export type PostingLine = (string | { k: string; text?: string })[];

export const EXAMPLE = {
  company: "Northwind",
  role: "Marketing Manager",
  candidate: "Alex Rivera",
  gaps: ["HubSpot"],
  // The posting's requirements, split the way the tailor prompt tiers them.
  // With the real 70/30 weights and HubSpot missing they score
  // 4/5 × 70 + 3/3 × 30 = 86.
  mustHave: ["SEO", "Campaign strategy", "Google Analytics", "Budget management", "HubSpot"],
  niceToHave: ["Team leadership", "A/B testing", "Copywriting"],
  // Posting body: strings, or { k } where a requirement appears (`text` when
  // the words on the page differ from the requirement's name).
  posting: [
    ["You'll own our ", { k: "Campaign strategy", text: "campaign strategy" }, " across email and social, manage a $1.2M ", { k: "Budget management", text: "budget" }, " and report results in ", { k: "Google Analytics" }, "."],
    ["You bring strong ", { k: "SEO" }, " skills, hands-on ", { k: "HubSpot" }, " experience and a record of ", { k: "Team leadership", text: "team leadership" }, ". ", { k: "A/B testing" }, " and ", { k: "Copywriting", text: "copywriting" }, " are a plus."],
  ] as PostingLine[],
  // Every rewrite keeps the facts and only borrows the posting's words.
  bullets: [
    { before: "Handled social media and email marketing that grew leads 38%", after: ["Owned ", "campaign strategy", " for email and social, growing qualified leads 38%"] },
    { before: "Managed $1.2M in paid media spend across four channels", after: ["Owned a $1.2M paid media ", "budget", " across four channels"] },
    { before: "Wrote blog posts that grew organic traffic 64%", after: ["Grew organic traffic 64% with an ", "SEO", " content program"] },
  ] as { before: string; after: [string, string, string] }[],
  skillsBefore: "Analytics, copy, testing, managed a team of 4",
  skillsAfter: ["Google Analytics", "A/B testing", "Copywriting", "Team leadership"],
  score: 86,
};

export const TIERS = [
  { label: "Must-have", points: 70, keywords: EXAMPLE.mustHave },
  { label: "Nice to have", points: 30, keywords: EXAMPLE.niceToHave },
];

// Requirements in the order they appear in the posting.
export const FOUND = EXAMPLE.posting.flat().flatMap((s) => (typeof s === "string" ? [] : [s.k]));

export function Line({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-[7px] rounded-full bg-[#EFEDEA] ${className}`} style={{ width: w }} />;
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="font-cm-mono text-[10.5px] tracking-[0.08em] text-cm-subtle uppercase">{children}</div>;
}

export function Hl({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`rounded bg-cm-brand-tint px-1 text-cm-brand-ink ${className}`}>{children}</span>;
}

export function BrowserFrame({
  url,
  toolbar,
  children,
  className = "",
}: {
  url: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-[16px] bg-white shadow-[0_20px_50px_-24px_rgba(30,27,75,0.25)] ${className}`}>
      <div className="relative z-20 flex h-9 items-center gap-1.5 rounded-t-[16px] bg-[#F2F0ED] px-3.5">
        <span className="size-2.5 rounded-full bg-[#E0DCD7]" />
        <span className="size-2.5 rounded-full bg-[#E0DCD7]" />
        <span className="size-2.5 rounded-full bg-[#E0DCD7]" />
        <div className="mr-2 ml-3 flex h-5 flex-1 items-center truncate rounded-full bg-white px-2.5 text-[11px] text-cm-subtle">
          {url}
        </div>
        {toolbar}
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[16px]">{children}</div>
    </div>
  );
}
