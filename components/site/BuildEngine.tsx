"use client";

// "Agents build the page as you scroll".
// Every element marked [data-build] gets a --t from 0 to 1. CSS turns --t into the
// reveal; this engine draws the wireframe boxes and flies the agent cursors.
// Intro: the hero character calls the agents, four dots orbit him, then fly off to build.

import { useEffect, useRef } from "react";

type Kind = "box" | "text" | "image" | "data" | "check";
type Item = {
  el: HTMLElement;
  kind: Kind;
  top: number; // document coordinates
  left: number;
  w: number;
  h: number;
  t: number; // monotonic build progress
  overlay: HTMLDivElement;
};
type Job = { i: number; start: number; dur: number };

const COLORS = ["#5b5bf0", "#e2563b", "#11a37f", "#d99a06"];
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** At most this many agents building at once. Calmer to watch. */
const MAX_ACTIVE = 2;
const QUIET_AFTER = 1400; // ms a job may wait for an agent before it fades in by itself
const BASE: Record<Kind, number> = { box: 750, text: 1000, image: 700, data: 1800, check: 650 };
const EASE = 0.09; // cursor glide per frame
// Intro timing (ms from load), matched to the speech bubble in HeroCharacter.
const ORBIT_IN = 500;
const RELEASE = 1900;
const LAP = 1000; // one orbit

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
      return { el, kind: (el.dataset.build as Kind) || "box", top: 0, left: 0, w: 0, h: 0, t: 0, overlay };
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

    const hero = document.querySelector<HTMLElement>("[data-hero-character]");
    const t0 = performance.now();
    // Skip the intro when the character isn't on screen (e.g. reloaded halfway down the page).
    const heroRect = hero?.getBoundingClientRect();
    let intro = !!heroRect && heroRect.bottom > 0 && heroRect.top < window.innerHeight;

    const pos = COLORS.map(() => ({ x: 0, y: 0, init: false }));
    const pending: number[] = [];
    const current: (Job | null)[] = COLORS.map(() => null);
    const queued = new Map<number, number>(); // item → when it became work
    const jobsDone = COLORS.map(() => 0);
    let raf = 0;
    let releasedAt = -1e9;

    function finishNow(i: number) {
      const it = items[i];
      it.t = 1;
      it.el.style.setProperty("--t", "1");
      it.el.dataset.done = "1";
    }
    const onScreen = (i: number, sy: number, vh: number) => {
      const vt = items[i].top - sy;
      return vt + items[i].h > 0 && vt < vh;
    };

    // Four dots circle the character's waist, nearer dots larger, like rings around a planet.
    function orbit(now: number) {
      const r = hero!.getBoundingClientRect();
      const e = now - t0;
      const grow = clamp((e - ORBIT_IN) / 350);
      COLORS.forEach((_, a) => {
        const c = cursorRefs.current[a];
        if (!c) return;
        const ang = (e / LAP) * Math.PI * 2 + (a * Math.PI) / 2;
        const depth = Math.sin(ang);
        const x = r.left + r.width * 0.5 + Math.cos(ang) * r.width * 0.36 * grow;
        const y = r.top + r.height * 0.55 + depth * r.height * 0.1 * grow;
        Object.assign(pos[a], { x, y, init: true });
        c.dataset.away = grow > 0 ? "1" : "0";
        c.dataset.mode = "dot";
        c.style.transform = `translate(${x}px, ${y}px) scale(${0.8 + 0.3 * depth})`;
        c.style.opacity = String(grow * (0.5 + 0.5 * Math.max(depth, 0)));
      });
    }

    function frame(now: number) {
      if (intro) {
        if (now - t0 < RELEASE) {
          orbit(now);
          raf = requestAnimationFrame(frame);
          return;
        }
        intro = false;
        releasedAt = now;
      }

      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const sy = window.scrollY;
      const targets: ({ x: number; y: number } | null)[] = COLORS.map(() => null);
      let busy = false;

      // Anything that has entered the viewport (or is above it) becomes work.
      items.forEach((it, i) => {
        if (it.t >= 1 || queued.has(i)) return;
        if (it.top - sy < vh * 0.98) {
          queued.set(i, now);
          pending.push(i);
        }
      });
      // Nobody is watching work that has left the screen: finish it instantly.
      for (let k = pending.length - 1; k >= 0; k--) if (!onScreen(pending[k], sy, vh)) finishNow(pending.splice(k, 1)[0]);
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

      // The least-busy idle agent takes the next job.
      while (pending.length && current.filter(Boolean).length < MAX_ACTIVE) {
        const i = pending.shift()!;
        const idle = COLORS.map((_, a) => a).filter((a) => !current[a]);
        const a = idle.reduce((m, x) => (jobsDone[x] < jobsDone[m] ? x : m));
        items[i].overlay.style.setProperty("--c", COLORS[a]);
        current[a] = { i, start: now, dur: BASE[items[i].kind] };
      }

      COLORS.forEach((color, a) => {
        let job = current[a];
        if (job && !onScreen(job.i, sy, vh)) {
          items[job.i].overlay.style.display = "none";
          finishNow(job.i);
          current[a] = job = null;
        }
        if (!job) return;
        busy = true;
        const it = items[job.i];
        const p = clamp((now - job.start) / job.dur);
        const viewTop = it.top - sy;
        it.t = p;
        it.el.style.setProperty("--t", p.toFixed(3));

        const o = it.overlay;
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
          window.dispatchEvent(new CustomEvent("site-log", { detail: { color } }));
        }
      });

      COLORS.forEach((_, a) => {
        const c = cursorRefs.current[a];
        if (!c) return;
        const p = pos[a];
        // Right after the intro, agents without a job still fly off into the page before fading out.
        const drift = now - releasedAt < 600;
        if (drift) busy = true;
        const tgt = targets[a] ?? (drift ? { x: vw * (0.2 + 0.2 * a), y: vh - 30 } : null);
        c.dataset.away = tgt && (targets[a] || now - releasedAt < 350) ? "1" : "0";
        c.dataset.mode = "pointer";
        c.style.opacity = "";
        // Idle agents fade out where they stopped. Without the intro, the first job glides in from below.
        if (!tgt) return;
        if (!p.init) Object.assign(p, { x: vw / 2, y: vh + 30, init: true });
        p.x += (tgt.x - p.x) * EASE;
        p.y += (tgt.y - p.y) * EASE;
        if (Math.abs(tgt.x - p.x) > 0.5 || Math.abs(tgt.y - p.y) > 0.5) busy = true;
        c.style.transform = `translate(${p.x}px, ${p.y}px)`;
      });

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
      {COLORS.map((c, i) => (
        <div
          key={c}
          ref={(el) => {
            cursorRefs.current[i] = el;
          }}
          className="site-cursor"
          style={{ ["--c" as string]: c }}
          aria-hidden="true"
        >
          <span className="site-cursor-dot" />
          <svg width="16" height="18" viewBox="0 0 16 18">
            <path d="M1 1 L1 15 L5 11 L8 17 L10.5 16 L7.6 10 L13 10 Z" fill="var(--c)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </>
  );
}
