"use client";

import { useEffect, useRef, useState } from "react";
import { RULES } from "@/content/agentRules";
import { activeIndex } from "@/lib/carousel";

// "How I ship with agents": the lstack rules as a sideways-scrolling row of line drawings.
export default function AgentRules() {
  const row = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const el = row.current!;
    const cards = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("on")), { threshold: 0.6 });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const step = () => {
    const c = row.current!.children;
    return c.length > 1 ? (c[1] as HTMLElement).offsetLeft - (c[0] as HTMLElement).offsetLeft : 0;
  };
  const go = (d: number) => row.current!.scrollBy({ left: d * step(), behavior: "smooth" });

  return (
    <div className="mt-8" data-build="box" data-label="lstack rules">
      <div className="flex items-end justify-between gap-4">
        <p className="text-[#6d6962]">
          Packaged as{" "}
          <a href="https://github.com/TheLinc/lstack" className="mono font-semibold text-[#1d1c1a] underline-offset-4 hover:underline">
            lstack
          </a>
          , open source on GitHub ↗
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span className="mono mr-1 text-xs text-[#8a8478]" aria-live="polite">
            {at + 1} / {RULES.length}
          </span>
          <button type="button" aria-label="Previous rule" onClick={() => go(-1)} disabled={at === 0} className="grid size-9 place-items-center rounded-full border-[1.5px] border-[#1d1c1a] disabled:opacity-30">
            ←
          </button>
          <button type="button" aria-label="Next rule" onClick={() => go(1)} disabled={at === RULES.length - 1} className="grid size-9 place-items-center rounded-full border-[1.5px] border-[#1d1c1a] disabled:opacity-30">
            →
          </button>
        </div>
      </div>

      <div ref={row} className="rules-row" onScroll={(e) => { const el = e.currentTarget; setAt(activeIndex(el.scrollLeft, step(), RULES.length, el.scrollWidth - el.clientWidth)); }}>
        {RULES.map((r, i) => (
          <article key={r.title} className="rules-card">
            <svg viewBox="0 0 200 130" aria-hidden="true">
              <g filter="url(#pen)">{r.art}</g>
            </svg>
            <p className="mono mt-3 text-[11px] font-semibold text-[#b0a99c]">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-0.5 text-[17px]">{r.title}</h3>
            <p className="mt-1 text-[13px] leading-snug text-[#6d6962]">{r.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {RULES.map((r, i) => (
          <i key={r.title} className={`size-1.5 rounded-full ${i === at ? "bg-[#1d1c1a]" : "bg-[#ddd6ca]"}`} />
        ))}
      </div>

      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="pen">
          <feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves={2} seed={4} />
          <feDisplacementMap in="SourceGraphic" scale={1.8} />
        </filter>
      </svg>
    </div>
  );
}
