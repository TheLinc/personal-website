"use client";

// "Search my experience": type a skill from a job posting, get the real lines where Lincoln used it.
// Plain language up front (for recruiters); the terminal framing is only a light touch.

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { grep, suggest, SKILL_COUNT } from "@/lib/careerIndex";

const CHIPS = ["React", "AI", "Payments", "TypeScript", "Leadership", "Testing", "AWS", "Accessibility", "Postgres", "Mobile"];
const DEMO = "AI";
/** Logos that are already full square tiles. */
const TILES = new Set(["/assets/core.png", "/assets/openroom.png"]);

/** "cover-me/billing" → "Cover Me" · "Billing", so results read as places, not file paths. */
const PLACES: Record<string, string> = {
  "opinion-system": "Opinion System",
  "core-manufacturing": "Core Manufacturing",
  "cover-me": "Cover Me",
  "open-room": "Open Room",
  gbatteries: "GBatteries",
  "trading-central": "Trading Central",
};
const AREAS: Record<string, string> = {
  ui: "Interface",
  aws: "AWS",
  mcp: "MCP",
  ai: "AI integrations",
  "ai-chat": "AI chat",
  sim: "Simulation",
  viz: "Data visualisation",
};
function label(path: string) {
  const [place, area] = path.split("/");
  const nice = AREAS[area] ?? area.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
  return { place: PLACES[place] ?? place, area: nice };
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[#fff0b8] px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function CareerGrep() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const touched = useRef(false);
  const timers = useRef<number[]>([]);

  const hits = useMemo(() => grep(query), [query]);
  const near = useMemo(() => (query && hits.length === 0 ? suggest(query) : []), [query, hits.length]);

  // An agent "types" a query into the box, one character at a time.
  function run(q: string) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduced) return setQuery(q);
    setTyping(true);
    setQuery("");
    [...q].forEach((_, i) => timers.current.push(window.setTimeout(() => setQuery(q.slice(0, i + 1)), 70 * (i + 1))));
    timers.current.push(
      window.setTimeout(() => setTyping(false), 70 * q.length + 60),
    );
  }

  // One demo search when the section first scrolls in, unless the visitor got there first.
  useEffect(() => {
    if (!inView || touched.current) return;
    const t = window.setTimeout(() => !touched.current && run(DEMO), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <div ref={ref} className="card mt-10 overflow-hidden">
      <div className="mono flex items-center gap-1.5 border-b border-[#e8e3da] px-4 py-3 text-[13px]">
        <span className="size-2.5 rounded-full bg-[#ef6a5a]" />
        <span className="size-2.5 rounded-full bg-[#f2c14e]" />
        <span className="size-2.5 rounded-full bg-[#5cc78a]" />
        <span className="ml-2 text-[#6d6962]">~/career</span>
      </div>

      <div className="mono space-y-1 px-5 pt-4 text-[12px] text-[#6d6962]" data-build="data" data-label="npm install">
        <p>
          <span className="text-[#11a37f]">$</span> npm install lincoln-laylor
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="h-2 w-40 overflow-hidden rounded-full bg-[#efebe3]">
            <span className="block h-full rounded-full bg-[#5b5bf0]" style={{ width: "calc(var(--r) * 100%)" }} />
          </span>
          <span className="tick">added {SKILL_COUNT} skills from 4+ years of shipping</span>
        </div>
      </div>

      <div className="px-5 pt-6">
        <label htmlFor="skill-search" className="block text-[17px] font-semibold text-[#1d1c1a]">
          What skill are you looking for?
        </label>
        <p className="mt-1 text-sm text-[#6d6962]">
          Type a skill or tool from a job posting and I&apos;ll show where I&apos;ve actually used it.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#e8e3da] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-[#5b5bf0] focus-within:ring-2 focus-within:ring-[#5b5bf0]/15">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d6962" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="skill-search"
            type="search"
            value={query}
            onChange={(e) => {
              touched.current = true;
              timers.current.forEach(clearTimeout);
              setTyping(false);
              setQuery(e.target.value);
            }}
            placeholder="e.g. React, payments, AI"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1d1c1a] outline-none placeholder:text-[#a8a29a] focus-visible:outline-none"
          />
          {typing && <span className="h-4 w-1.5 animate-pulse bg-[#1f8fd6]" aria-hidden="true" />}
          {query && !typing && (
            <button
              type="button"
              onClick={() => {
                touched.current = true;
                setQuery("");
              }}
              className="rounded-full px-2 text-sm text-[#6d6962] hover:text-[#1d1c1a]"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pt-3">
        <span className="text-xs text-[#6d6962]">Try:</span>
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              touched.current = true;
              run(c);
            }}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${query.toLowerCase() === c.toLowerCase() ? "border-[#5b5bf0] bg-[#f4f2ff] text-[#4646c8]" : "border-[#e8e3da] bg-white hover:border-[#1d1c1a]"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="min-h-[220px] px-5 pb-5 pt-5" aria-live="polite">
        {!query ? (
          <p className="text-sm text-[#a8a29a]">Every result is a real line from my work, never a guess.</p>
        ) : typing ? null : hits.length ? (
          <>
            <p className="text-sm font-semibold text-[#1d1c1a]">
              {hits.length} place{hits.length === 1 ? "" : "s"} I&apos;ve used &ldquo;{query}&rdquo;
              {hits.length > 6 && <span className="font-normal text-[#6d6962]"> · showing the top 6</span>}
            </p>
            <ol className="mt-3 space-y-2">
              {hits.slice(0, 6).map((h, i) => {
                const l = label(h.path);
                return (
                  <li
                    key={h.path}
                    className="grep-hit grid grid-cols-[28px_1fr] items-center gap-x-3 gap-y-1 rounded-xl border border-[#efebe3] bg-[#fdfcfa] px-3 py-2.5 sm:items-start"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    {/* Phones: logo beside the place line, the result itself full width below it. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={h.logo}
                      alt=""
                      className={`size-7 rounded-lg sm:row-span-2 sm:mt-0.5 ${TILES.has(h.logo ?? "") ? "object-cover" : "border border-[#e8e3da] bg-white object-contain p-0.5"}`}
                    />
                    <p className="min-w-0 text-[13px]">
                      <b className="text-[#1d1c1a]">{l.place}</b>
                      <span className="text-[#6d6962]"> · {l.area}</span>
                    </p>
                    <p className="col-span-2 text-[14px] leading-snug text-[#3a3733] sm:col-span-1 sm:col-start-2">
                      <Highlight text={h.text} q={query} />
                    </p>
                  </li>
                );
              })}
            </ol>
          </>
        ) : (
          <div className="text-sm text-[#6d6962]">
            <p>Nothing on &ldquo;{query}&rdquo; yet.</p>
            {near.length > 0 && (
              <p className="mt-1">
                Did you mean{" "}
                {near.map((n, i) => (
                  <button key={n} type="button" onClick={() => run(n)} className="text-[#5b5bf0] underline underline-offset-2">
                    {n}
                    {i < near.length - 1 ? ", " : ""}
                  </button>
                ))}
                ?
              </p>
            )}
            <p className="mt-1">
              Not here?{" "}
              <a href="mailto:lincolnlaylor@gmail.com" className="text-[#5b5bf0] underline underline-offset-2">
                Ask me about it
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
