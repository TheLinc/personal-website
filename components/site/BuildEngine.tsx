"use client";

// throwaway prototype of "agents build the page as you scroll".
// Every element marked [data-build] gets a --t from 0 to 1. CSS turns --t into the
// reveal; this engine draws the wireframe boxes, flies the agent cursors and runs the dock.

import { useEffect, useRef, useState } from "react";

type Kind = "box" | "text" | "image" | "data" | "check";
type Agent = { name: string; role: string; color: string; kinds: Kind[] };

const AGENTS: Agent[] = [
  { name: "Ada", role: "layout", color: "#5b5bf0", kinds: ["box"] },
  { name: "Byte", role: "copy", color: "#e2563b", kinds: ["text"] },
  { name: "Kit", role: "copy", color: "#1f8fd6", kinds: ["text"] },
  { name: "Pix", role: "images", color: "#11a37f", kinds: ["image"] },
  { name: "Dot", role: "data", color: "#d99a06", kinds: ["data"] },
  { name: "Rev", role: "review", color: "#d23f8f", kinds: ["check"] },
];
const VERB: Record<Kind, string> = { box: "laid out", text: "wrote", image: "placed", data: "plotted", check: "verified" };

type Item = {
  el: HTMLElement;
  kind: Kind;
  agent: number;
  label: string;
  top: number; // document coordinates
  left: number;
  w: number;
  h: number;
  t: number; // monotonic build progress
  overlay: HTMLDivElement;
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function BuildEngine() {
  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [built, setBuilt] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState("Agents standing by");
  const [away, setAway] = useState<boolean[]>(AGENTS.map(() => false));
  const rebuildRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".site")!;
    const layer = layerRef.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-build]"));
    const counters: Record<string, number> = {};

    const items: Item[] = els.map((el) => {
      const kind = (el.dataset.build as Kind) || "box";
      const pool = AGENTS.map((a, i) => (a.kinds.includes(kind) ? i : -1)).filter((i) => i >= 0);
      const n = (counters[kind] = (counters[kind] ?? -1) + 1);
      const overlay = document.createElement("div");
      overlay.className = "site-box";
      const agent = pool[n % pool.length];
      overlay.style.setProperty("--c", AGENTS[agent].color);
      const tag = document.createElement("span");
      overlay.appendChild(tag);
      layer.appendChild(overlay);
      return {
        el,
        kind,
        agent,
        label: el.dataset.label || el.tagName.toLowerCase(),
        top: 0,
        left: 0,
        w: 0,
        h: 0,
        t: 0,
        overlay,
      };
    });
    setTotal(items.length);

    if (reduced) {
      items.forEach((it) => it.el.style.setProperty("--t", "1"));
      setBuilt(items.length);
      setLog("Built (reduced motion)");
      return () => items.forEach((it) => it.overlay.remove());
    }

    root.classList.add("armed");
    items.forEach((it) => it.el.style.setProperty("--t", "0"));

    function measure() {
      items.forEach((it) => {
        const r = it.el.getBoundingClientRect();
        it.top = r.top + window.scrollY;
        it.left = r.left + window.scrollX;
        it.w = r.width;
        it.h = r.height;
        const tag = it.overlay.firstChild as HTMLSpanElement;
        tag.textContent = `${AGENTS[it.agent].name} · ${it.label}`;
      });
    }

    // One shared pool of visible work. Each idle agent takes the next job, preferring its speciality.
    const pos = AGENTS.map(() => ({ x: -100, y: -100, init: false }));
    const pending: number[] = [];
    const current: ({ i: number; start: number; dur: number } | null)[] = AGENTS.map(() => null);
    const queued = new Set<number>();
    let builtCount = 0;
    let raf = 0;
    let awayState = AGENTS.map(() => false);
    const BASE: Record<Kind, number> = { box: 420, text: 560, image: 380, data: 1100, check: 330 };

    function finishNow(i: number) {
      const it = items[i];
      it.t = 1;
      it.el.style.setProperty("--t", "1");
      it.el.dataset.done = "1";
      builtCount++;
      setBuilt(builtCount);
    }

    function frame(now: number) {
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const targets: ({ x: number; y: number } | null)[] = AGENTS.map(() => null);
      let busy = false;

      // Anything that has entered the viewport (or is above it) becomes work.
      items.forEach((it, i) => {
        if (it.t >= 1 || queued.has(i)) return;
        if (it.top - sy < vh * 0.9) {
          queued.add(i);
          pending.push(i);
        }
      });
      // Nobody is watching work that has left the screen: finish it instantly.
      for (let k = pending.length - 1; k >= 0; k--) {
        const it = items[pending[k]];
        const vt = it.top - sy;
        if (vt + it.h < 0 || vt > vh) finishNow(pending.splice(k, 1)[0]);
      }
      pending.sort((x, y) => items[x].top - items[y].top);

      AGENTS.forEach((agent, a) => {
        if (!current[a] && pending.length) {
          let k = pending.findIndex((i) => agent.kinds.includes(items[i].kind));
          if (k < 0) k = 0;
          const i = pending.splice(k, 1)[0];
          const it = items[i];
          it.agent = a;
          it.overlay.style.setProperty("--c", agent.color);
          (it.overlay.firstChild as HTMLSpanElement).textContent = `${agent.name} · ${it.label}`;
          // A backlog means the reader is ahead of the crew: rush.
          const dur = Math.max(140, BASE[it.kind] / (1 + pending.length * 0.25));
          current[a] = { i, start: now, dur };
        }
        let job = current[a];
        if (job) {
          const jt = items[job.i].top - sy;
          if (jt + items[job.i].h < 0 || jt > vh) {
            items[job.i].overlay.style.display = "none";
            finishNow(job.i);
            current[a] = job = null;
          }
        }
        if (!job) return;
        busy = true;
        const it = items[job.i];
        it.t = clamp((now - job.start) / job.dur);
        const t = it.t;
        const viewTop = it.top - sy;
        it.el.style.setProperty("--t", t.toFixed(3));

        const o = it.overlay;
        const drag = clamp(t / 0.35);
        const reveal = clamp((t - 0.35) / 0.5);
        o.style.display = t >= 1 ? "none" : "block";
        o.style.transform = `translate(${it.left}px, ${it.top}px)`;
        o.style.width = `${Math.max(2, it.w * drag)}px`;
        o.style.height = `${Math.max(2, it.h * drag)}px`;
        o.style.opacity = t > 0.85 ? String((1 - t) / 0.15) : "1";

        if (t < 0.35) targets[a] = { x: it.left + it.w * drag, y: viewTop + it.h * drag };
        else if (it.kind === "text" || it.kind === "data") targets[a] = { x: it.left + it.w * reveal, y: viewTop + Math.min(it.h * 0.5, 22) };
        else targets[a] = { x: it.left + it.w * 0.55, y: viewTop + it.h * 0.6 };

        if (t >= 1) {
          it.el.dataset.done = "1";
          current[a] = null;
          builtCount++;
          setBuilt(builtCount);
          const msg = `${AGENTS[a].name} ${VERB[it.kind]} ${it.label}`;
          setLog(msg);
          window.dispatchEvent(new CustomEvent("site-log", { detail: { msg, color: AGENTS[a].color, ms: Math.round(job.dur) } }));
        }
      });

      const nextAway = AGENTS.map((_, a) => !!current[a]);
      if (nextAway.some((v, a) => v !== awayState[a])) {
        awayState = nextAway;
        setAway(nextAway);
      }

      AGENTS.forEach((_, a) => {
        const c = cursorRefs.current[a];
        const slot = slotRefs.current[a];
        if (!c || !slot) return;
        const home = slot.getBoundingClientRect();
        const tgt = targets[a] ?? { x: home.left + home.width / 2 - 2, y: home.top + 2 };
        const p = pos[a];
        if (!p.init) {
          p.x = tgt.x;
          p.y = tgt.y;
          p.init = true;
        }
        p.x += (tgt.x - p.x) * 0.3;
        p.y += (tgt.y - p.y) * 0.3;
        if (Math.abs(tgt.x - p.x) > 0.5 || Math.abs(tgt.y - p.y) > 0.5) busy = true;
        c.style.transform = `translate(${p.x}px, ${p.y}px)`;
        c.dataset.away = targets[a] ? "1" : "0";
      });

      raf = busy ? requestAnimationFrame(frame) : 0;
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    rebuildRef.current = () => {
      items.forEach((it) => {
        it.t = 0;
        it.el.style.setProperty("--t", "0");
        delete it.el.dataset.done;
      });
      pending.length = 0;
      current.fill(null);
      queued.clear();
      builtCount = 0;
      setBuilt(0);
      setLog("Rebuilding…");
      kick();
    };

    measure();
    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(root);
    document.fonts?.ready.then(() => {
      measure();
      kick();
    });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      root.classList.remove("armed");
      items.forEach((it) => it.overlay.remove());
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className="site-layer" aria-hidden="true" />
      {AGENTS.map((a, i) => (
        <div
          key={a.name}
          ref={(el) => {
            cursorRefs.current[i] = el;
          }}
          className="site-cursor"
          style={{ ["--c" as string]: a.color }}
          aria-hidden="true"
        >
          <svg width="16" height="18" viewBox="0 0 16 18">
            <path d="M1 1 L1 15 L5 11 L8 17 L10.5 16 L7.6 10 L13 10 Z" fill="var(--c)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <span>{a.name}</span>
        </div>
      ))}

      <div className="site-dock" role="status" aria-live="polite">
        <div className="site-dock-agents" aria-hidden="true">
          {AGENTS.map((a, i) => (
            <span key={a.name} className="site-slot" data-away={away[i] ? "1" : "0"} title={`${a.name} · ${a.role}`}>
              <span
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
                className="site-slot-dot"
                style={{ ["--c" as string]: a.color }}
              />
              <span className="site-slot-name">{a.name}</span>
            </span>
          ))}
        </div>
        <div className="site-dock-meta">
          <span className="site-dock-long">
            <b>{AGENTS.filter((_, i) => away[i]).length} of {AGENTS.length} agents working</b> · {built}/{total} layers
          </span>
          <span className="site-dock-short">
            <b>{AGENTS.filter((_, i) => away[i]).length}/{AGENTS.length} working</b> · {built}/{total}
          </span>
          <span className="site-log">{log}</span>
        </div>
        <button type="button" className="site-rebuild" onClick={() => rebuildRef.current()}>
          ↺ Rebuild
        </button>
      </div>
    </>
  );
}
