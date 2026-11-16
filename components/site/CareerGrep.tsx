"use client";

// "grep my career". Type a keyword from a job posting, get the real lines where Lincoln used it.

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { grep, suggest, SKILL_COUNT } from "@/lib/careerIndex";

const CHIPS = ["TypeScript", "React", "AI", "Stripe", "Postgres", "Testing", "AWS", "Leadership", "Accessibility", "Agents"];
const DEMO = "AI";
const KIT = "#1f8fd6";
/** Logos that are already full square tiles. */
const TILES = new Set(["/assets/core.png", "/assets/openroom.png"]);

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

  // An agent "types" a query into the prompt, one character at a time.
  function run(q: string) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduced) return setQuery(q);
    setTyping(true);
    setQuery("");
    [...q].forEach((_, i) => timers.current.push(window.setTimeout(() => setQuery(q.slice(0, i + 1)), 70 * (i + 1))));
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        window.dispatchEvent(new CustomEvent("site-log", { detail: { msg: `Kit grepped "${q}"`, color: KIT, ms: 70 * q.length } }));
      }, 70 * q.length + 60),
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
    <div ref={ref} className="card mono mt-10 overflow-hidden text-[13px]">
      <div className="flex items-center gap-1.5 border-b border-[#e8e3da] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ef6a5a]" />
        <span className="size-2.5 rounded-full bg-[#f2c14e]" />
        <span className="size-2.5 rounded-full bg-[#5cc78a]" />
        <span className="ml-2 text-[#6d6962]">~/career</span>
      </div>

      <div className="space-y-1 px-5 pt-4 text-[#6d6962]" data-build="data" data-label="npm install">
        <p><span className="text-[#11a37f]">$</span> npm install lincoln-laylor</p>
        <div className="flex items-center gap-3">
          <span className="h-2 w-48 overflow-hidden rounded-full bg-[#efebe3]">
            <span className="block h-full rounded-full bg-[#5b5bf0]" style={{ width: "calc(var(--r) * 100%)" }} />
          </span>
          <span className="tick">added {SKILL_COUNT} skills from 4+ years of shipping, 0 vulnerabilities</span>
        </div>
      </div>

      <label className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-[#e8e3da] bg-[#fbfaf7] px-3 py-2.5 focus-within:border-[#5b5bf0]">
        <span className="text-[#11a37f]">$</span>
        <span className="text-[#6d6962]">grep -ri</span>
        <input
          value={query}
          onChange={(e) => {
            touched.current = true;
            timers.current.forEach(clearTimeout);
            setTyping(false);
            setQuery(e.target.value);
          }}
          placeholder="a keyword from your job posting"
          aria-label="Search Lincoln's experience for a skill"
          className="min-w-0 flex-1 bg-transparent text-[#1d1c1a] outline-none focus-visible:outline-none placeholder:text-[#a8a29a]"
        />
        <span className="hidden text-[#6d6962] sm:inline">~/career</span>
        {typing && <span className="h-4 w-1.5 animate-pulse bg-[#1f8fd6]" aria-hidden="true" />}
      </label>

      <div className="flex flex-wrap gap-2 px-5 pt-3">
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

      <div className="min-h-[220px] px-5 pb-5 pt-4" aria-live="polite">
        {!query ? (
          <p className="text-[#a8a29a]">Type a skill, or pick one above. Every match is a real line from my work.</p>
        ) : typing ? null : hits.length ? (
          <>
            <ol className="space-y-2">
              {hits.slice(0, 6).map((h, i) => (
                <li
                  key={h.path}
                  className="grep-hit grid grid-cols-[22px_1fr] gap-3 rounded-xl px-2 py-1.5 hover:bg-[#fbfaf7] sm:grid-cols-[22px_230px_1fr]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {h.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={h.logo} alt="" className={`mt-0.5 size-[22px] rounded-md ${TILES.has(h.logo) ? "object-cover" : "border border-[#e8e3da] bg-white object-contain p-0.5"}`} />
                  ) : (
                    <span className="mt-0.5 grid size-[22px] place-items-center rounded-md bg-[#ece7dd] text-[9px] font-bold text-[#6d6962]">CM</span>
                  )}
                  <span className="text-[#5b5bf0]">{h.path}</span>
                  <span className="col-start-2 font-sans text-[14px] leading-snug text-[#1d1c1a] sm:col-start-3">
                    <Highlight text={h.text} q={query} />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[#6d6962]">
              {hits.length} match{hits.length === 1 ? "" : "es"}
              {hits.length > 6 && ` · showing the top 6`}
            </p>
          </>
        ) : (
          <div className="text-[#6d6962]">
            <p>No matches for &ldquo;{query}&rdquo;.</p>
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
              Not here yet? <a href="mailto:lincolnlaylor@gmail.com" className="text-[#5b5bf0] underline underline-offset-2">Ask me about it</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
