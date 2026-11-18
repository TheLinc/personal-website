"use client";

// "AI models build the page as you scroll".
// Every element marked [data-build] gets a --t from 0 to 1. CSS turns --t into the
// reveal; this engine draws the wireframe boxes and flies the model cursors.
// The running joke: Gemini's work comes out crooked and Claude comes over to fix it.

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

type Kind = "box" | "text" | "image" | "data" | "check";
type Agent = { name: string; color: string; logo: string };

const AGENTS: Agent[] = [
  { name: "Claude", color: "#d97757", logo: "/assets/icons/claude.svg" },
  { name: "OpenAI", color: "#10a37f", logo: "/assets/icons/openai.svg" },
  { name: "Grok", color: "#1d1c1a", logo: "/assets/icons/grok.svg" },
  { name: "Gemini", color: "#4f7cf7", logo: "/assets/icons/gemini.svg" },
];
const CLAUDE = 0;
const GEMINI = 3;
const VERB: Record<Kind, string> = { box: "laid out", text: "wrote", image: "placed", data: "plotted", check: "verified" };

type Item = {
  el: HTMLElement;
  kind: Kind;
  label: string;
  top: number; // document coordinates
  left: number;
  w: number;
  h: number;
  t: number; // monotonic build progress
  overlay: HTMLDivElement;
};
type Job = { i: number; start: number; dur: number; fix?: boolean };

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** At most this many models building at once (a fix can add one more). Calmer to watch. */
const MAX_ACTIVE = 2;
const QUIET_AFTER = 1400; // ms a job may wait for a model before it fades in by itself
const BASE: Record<Kind, number> = { box: 750, text: 1000, image: 700, data: 1800, check: 650 };
const FIX_MS = 1100;
const EASE = 0.09; // cursor glide per frame

export default function BuildEngine() {
  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".site")!;
    const layer = layerRef.current!;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-build]"));

    const items: Item[] = els.map((el) => {
      const overlay = document.createElement("div");
      overlay.className = "site-box";
      layer.appendChild(overlay);
      return { el, kind: (el.dataset.build as Kind) || "box", label: el.dataset.label || el.tagName.toLowerCase(), top: 0, left: 0, w: 0, h: 0, t: 0, overlay };
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((it) => (it.el.dataset.done = "1"));
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
      });
    }

    const pos = AGENTS.map(() => ({ x: 0, y: 0, init: false }));
    const pending: number[] = [];
    const fixes: number[] = []; // Gemini's crooked work, waiting for Claude
    const current: (Job | null)[] = AGENTS.map(() => null);
    const queued = new Map<number, number>(); // item → when it became work
    const jobsDone = AGENTS.map(() => 0);
    let raf = 0;

    const log = (msg: string, a: number, ms: number) =>
      window.dispatchEvent(new CustomEvent("site-log", { detail: { msg, color: AGENTS[a].color, ms } }));

    function finishNow(i: number) {
      const it = items[i];
      it.t = 1;
      it.el.style.setProperty("--t", "1");
      it.el.dataset.done = "1";
    }

    // Tilt and nudge the finished element, unless it already uses translate/rotate for layout.
    function botch(i: number) {
      const { el, w } = items[i];
      const cs = getComputedStyle(el);
      if (cs.rotate !== "none" || cs.translate !== "none") return false;
      const deg = w > 600 ? 1.2 : w > 300 ? 2.4 : 3.5;
      el.style.transition = "rotate 450ms cubic-bezier(.3,1.6,.5,1), translate 450ms cubic-bezier(.3,1.6,.5,1)";
      el.style.rotate = `${jobsDone[GEMINI] % 2 ? deg : -deg}deg`;
      el.style.translate = `${jobsDone[GEMINI] % 2 ? -10 : 12}px 6px`;
      el.dataset.botched = "1";
      return true;
    }
    function unbotch(i: number) {
      const el = items[i].el;
      el.style.transition = "rotate 650ms ease-in-out, translate 650ms ease-in-out";
      el.style.rotate = "";
      el.style.translate = "";
      delete el.dataset.botched;
    }

    const onScreen = (i: number, sy: number, vh: number) => {
      const vt = items[i].top - sy;
      return vt + items[i].h > 0 && vt < vh;
    };

    function frame(now: number) {
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const sy = window.scrollY;
      const targets: ({ x: number; y: number } | null)[] = AGENTS.map(() => null);
      let busy = false;

      // Anything that has entered the viewport (or is above it) becomes work.
      items.forEach((it, i) => {
        if (it.t >= 1 || queued.has(i)) return;
        if (it.top - sy < vh * 0.9) {
          queued.set(i, now);
          pending.push(i);
        }
      });
      // Nobody is watching work that has left the screen: finish (or straighten) it instantly.
      for (let k = pending.length - 1; k >= 0; k--) if (!onScreen(pending[k], sy, vh)) finishNow(pending.splice(k, 1)[0]);
      for (let k = fixes.length - 1; k >= 0; k--) if (!onScreen(fixes[k], sy, vh)) unbotch(fixes.splice(k, 1)[0]);
      // The crew is small on purpose. Work nobody picked up soon fades in on its own, so the page is never blank.
      for (let k = pending.length - 1; k >= 0; k--) {
        const i = pending[k];
        if (now - queued.get(i)! > QUIET_AFTER) {
          pending.splice(k, 1);
          items[i].el.style.transition = "--t 700ms ease-out";
          finishNow(i);
        }
      }
      pending.sort((x, y) => items[x].top - items[y].top);

      // Claude drops everything else to fix Gemini's work.
      if (fixes.length && !current[CLAUDE]) {
        const i = fixes.shift()!;
        current[CLAUDE] = { i, start: now, dur: FIX_MS, fix: true };
        items[i].overlay.style.setProperty("--c", AGENTS[CLAUDE].color);
      }
      // Otherwise the least-busy idle model takes the next job.
      while (pending.length && current.filter(Boolean).length < MAX_ACTIVE) {
        const i = pending.shift()!;
        const idle = AGENTS.map((_, a) => a).filter((a) => !current[a]);
        const a = idle.reduce((m, x) => (jobsDone[x] < jobsDone[m] ? x : m));
        items[i].overlay.style.setProperty("--c", AGENTS[a].color);
        current[a] = { i, start: now, dur: BASE[items[i].kind] };
      }

      AGENTS.forEach((agent, a) => {
        let job = current[a];
        if (job && !onScreen(job.i, sy, vh)) {
          items[job.i].overlay.style.display = "none";
          if (job.fix) unbotch(job.i);
          else finishNow(job.i);
          current[a] = job = null;
        }
        if (!job) return;
        busy = true;
        const it = items[job.i];
        const p = clamp((now - job.start) / job.dur);
        const viewTop = it.top - sy;
        const o = it.overlay;

        if (job.fix) {
          // Claude outlines the crooked element, then straightens it.
          o.style.display = p >= 1 ? "none" : "block";
          o.style.transform = `translate(${it.left}px, ${it.top}px)`;
          o.style.width = `${it.w}px`;
          o.style.height = `${it.h}px`;
          o.style.opacity = p > 0.8 ? String((1 - p) / 0.2) : "1";
          if (p > 0.45 && it.el.dataset.botched) unbotch(job.i);
          targets[a] = { x: it.left + it.w * (0.3 + 0.4 * p), y: viewTop + it.h * 0.5 };
          if (p >= 1) {
            current[a] = null;
            log(`Claude fixed Gemini’s ${it.label}`, a, FIX_MS);
          }
          return;
        }

        it.t = p;
        it.el.style.setProperty("--t", p.toFixed(3));
        const drag = clamp(p / 0.35);
        const reveal = clamp((p - 0.35) / 0.5);
        o.style.display = p >= 1 ? "none" : "block";
        o.style.transform = `translate(${it.left}px, ${it.top}px)`;
        o.style.width = `${Math.max(2, it.w * drag)}px`;
        o.style.height = `${Math.max(2, it.h * drag)}px`;
        o.style.opacity = p > 0.85 ? String((1 - p) / 0.15) : "1";

        if (p < 0.35) targets[a] = { x: it.left + it.w * drag, y: viewTop + it.h * drag };
        else if (it.kind === "text" || it.kind === "data") targets[a] = { x: it.left + it.w * reveal, y: viewTop + Math.min(it.h * 0.5, 22) };
        else targets[a] = { x: it.left + it.w * 0.55, y: viewTop + it.h * 0.6 };

        if (p >= 1) {
          it.el.dataset.done = "1";
          current[a] = null;
          jobsDone[a]++;
          log(`${agent.name} ${VERB[it.kind]} ${it.label}`, a, job.dur);
          if (a === GEMINI && it.kind !== "data" && botch(job.i)) fixes.push(job.i);
        }
      });

      AGENTS.forEach((_, a) => {
        const c = cursorRefs.current[a];
        if (!c) return;
        const p = pos[a];
        const tgt = targets[a];
        c.dataset.away = tgt ? "1" : "0";
        c.dataset.fix = current[a]?.fix ? "1" : "0";
        // Idle models fade out where they stopped; the first job glides in from the bottom of the screen.
        if (!tgt) return;
        if (!p.init) Object.assign(p, { x: vw / 2, y: vh + 30, init: true });
        p.x += (tgt.x - p.x) * EASE;
        p.y += (tgt.y - p.y) * EASE;
        if (Math.abs(tgt.x - p.x) > 0.5 || Math.abs(tgt.y - p.y) > 0.5) busy = true;
        c.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });
      if (fixes.length) busy = true;

      raf = busy ? requestAnimationFrame(frame) : 0;
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
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
          <span className="site-cursor-tag">
            <img src={a.logo} alt="" />
            {a.name}
            {i === CLAUDE && <em>fixing Gemini’s work</em>}
          </span>
        </div>
      ))}
    </>
  );
}
