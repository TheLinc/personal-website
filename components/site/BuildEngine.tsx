"use client";

// "Agents build the page as you scroll".
// Every element marked [data-build] gets a --t from 0 to 1. CSS turns --t into the
// reveal; this engine draws the wireframe boxes and flies the agent cursors.

import { useEffect, useRef } from "react";

type Kind = "box" | "text" | "image" | "data" | "check";
type Item = {
  el: HTMLElement;
  kind: Kind;
  top: number; // document coordinates; for text, the bounds of the text itself
  left: number;
  w: number;
  h: number;
  t: number; // monotonic build progress
  overlay: HTMLDivElement;
};
type Job = { i: number; start: number; fromX: number; fromY: number; travel: number };
type Agent = { x: number; y: number; seen: boolean; job: Job | null; done: number };
type Pose = { x: number; y: number; t: number; bw: number; bh: number; fade: number; pressed: boolean; done: boolean };

const COLORS = ["#5b5bf0", "#e2563b", "#11a37f", "#d99a06"];
// Each agent has its own hand: how far its path bows sideways (share of the trip) and how fast it works.
const ARC = [0.2, -0.16, 0.12, -0.24];
const SPEED = [1, 0.82, 1.18, 0.92];
const MAX_ACTIVE = 2;
// The agents build the first few things you see, once. Everything after that fades in by itself,
// so the page never makes a reader wait for a cursor.
const AGENT_JOBS = 3;
const QUIET_AFTER = 1800; // ms a job may wait for an agent before it fades in by itself
const PRESS = 140;
const WORK: Record<Kind, number> = { box: 650, text: 900, image: 550, data: 1500, check: 550 };
const SETTLE = 420; // after letting go, the content settles in while the cursor steps aside

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const inOut = (q: number) => (q < 0.5 ? 4 * q * q * q : 1 - (-2 * q + 2) ** 3 / 2);
const out = (q: number) => 1 - (1 - q) ** 3;

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

    // Phones have no pointer, so a fake one would look out of place: everything just fades in.
    let budget = window.matchMedia("(pointer: fine)").matches ? AGENT_JOBS : 0;

    function measure() {
      const range = document.createRange();
      items.forEach((it) => {
        const box = it.el.getBoundingClientRect();
        let r = box;
        if (it.kind === "text") {
          range.selectNodeContents(it.el);
          const tr = range.getBoundingClientRect();
          if (tr.width > 0) r = tr;
          it.el.style.setProperty("--tx0", `${r.left - box.left}px`);
          it.el.style.setProperty("--tw", `${r.width}px`);
        }
        it.top = r.top + window.scrollY;
        it.left = r.left + window.scrollX;
        it.w = r.width;
        it.h = r.height;
      });
    }

    const agents: Agent[] = COLORS.map(() => ({ x: 0, y: 0, seen: false, job: null, done: 0 }));
    const pending: number[] = [];
    const queued = new Map<number, number>(); // item → when it became work
    let raf = 0;

    function finishNow(i: number) {
      const it = items[i];
      it.t = 1;
      it.el.style.setProperty("--t", "1");
      it.el.dataset.done = "1";
      delete it.el.dataset.building;
    }
    function fadeIn(i: number) {
      items[i].el.dataset.quiet = "1";
      finishNow(i);
    }
    const onScreen = (i: number, sy: number, vh: number) => {
      const vt = items[i].top - sy;
      return vt + items[i].h > 0 && vt < vh;
    };

    // Where agent a's cursor is, and how far its element is built, `e` ms into the job.
    // Box-like elements: travel to the top-left corner, press, drag the outline to the bottom-right,
    // let go and step aside while the content settles in. Text: press at the start of the line and
    // sweep across it, the words appearing right behind the cursor.
    function pose(a: number, job: Job, e: number): Pose {
      const it = items[job.i];
      const sweep = it.kind === "text" || it.kind === "data";
      const work = WORK[it.kind] / SPEED[a];
      const lineY = it.top + Math.min(it.h * 0.5, 22);
      const x0 = it.left;
      const y0 = sweep ? lineY : it.top;
      const p: Pose = { x: x0, y: y0, t: 0, bw: 0, bh: 0, fade: 1, pressed: false, done: false };

      if (e < job.travel) {
        const q = inOut(e / job.travel);
        const dx = x0 - job.fromX;
        const dy = y0 - job.fromY;
        const bow = Math.sin(Math.PI * q) * ARC[a];
        p.x = job.fromX + dx * q - dy * bow;
        p.y = job.fromY + dy * q + dx * bow;
        p.fade = 0;
        return p;
      }
      e -= job.travel;
      p.pressed = true;
      if (e < PRESS) {
        p.bw = 2;
        p.bh = sweep ? it.h : 2;
        return p;
      }
      e -= PRESS;
      if (e < work) {
        const q = e / work;
        if (sweep) {
          const r = 0.15 * q + 0.85 * inOut(q);
          p.x = x0 + it.w * r;
          p.bw = it.w * r;
          p.bh = it.h;
          p.t = 0.35 + 0.5 * r;
        } else {
          const r = inOut(q);
          p.x = x0 + it.w * r;
          p.y = y0 + it.h * r;
          p.bw = it.w * r;
          p.bh = it.h * r;
          p.t = 0.35 * r;
        }
        return p;
      }
      e -= work;
      p.pressed = false;
      const q = clamp(e / SETTLE);
      const r = out(q);
      p.x = x0 + it.w + 16 * r;
      p.y = (sweep ? lineY : y0 + it.h) + 12 * r;
      p.bw = it.w;
      p.bh = it.h;
      p.fade = 1 - q;
      p.t = sweep ? 0.85 + 0.15 * q : 0.35 + 0.65 * q;
      p.done = q >= 1;
      return p;
    }

    function frame(now: number) {
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const sx = window.scrollX;
      const sy = window.scrollY;
      let busy = false;

      // Anything that has entered the viewport (or is above it) becomes work.
      items.forEach((it, i) => {
        if (it.t >= 1 || queued.has(i)) return;
        if (it.top - sy >= vh * 0.98) return;
        queued.set(i, now);
        if (pending.length < budget) pending.push(i);
        else fadeIn(i);
      });
      // Nobody is watching work that has left the screen: finish it instantly.
      for (let k = pending.length - 1; k >= 0; k--) if (!onScreen(pending[k], sy, vh)) finishNow(pending.splice(k, 1)[0]);
      for (let k = pending.length - 1; k >= 0; k--) {
        const i = pending[k];
        if (now - queued.get(i)! > QUIET_AFTER) {
          pending.splice(k, 1);
          budget--;
          fadeIn(i);
        }
      }
      pending.sort((x, y) => items[x].top - items[y].top);

      // The least-busy idle agent takes the next job, starting from wherever its cursor is.
      while (pending.length && agents.filter((g) => g.job).length < MAX_ACTIVE) {
        const i = pending.shift()!;
        budget--;
        const idle = agents.map((_, a) => a).filter((a) => !agents[a].job);
        const a = idle.reduce((m, x) => (agents[x].done < agents[m].done ? x : m));
        const g = agents[a];
        if (!g.seen) Object.assign(g, { x: sx + vw * (0.3 + 0.12 * a), y: sy + vh + 40, seen: true });
        const it = items[i];
        const dist = Math.hypot(it.left - g.x, it.top - g.y);
        items[i].overlay.style.setProperty("--c", COLORS[a]);
        items[i].el.dataset.building = "1";
        g.job = { i, start: now, fromX: g.x, fromY: g.y, travel: Math.min(950, Math.max(280, dist * 0.55)) / SPEED[a] };
      }

      agents.forEach((g, a) => {
        const c = cursorRefs.current[a];
        let job = g.job;
        if (job && !onScreen(job.i, sy, vh)) {
          items[job.i].overlay.style.display = "none";
          finishNow(job.i);
          g.job = job = null;
          g.done++;
        }
        if (c) c.dataset.away = job ? "1" : "0";
        if (!job) return;
        busy = true;

        const it = items[job.i];
        const p = pose(a, job, now - job.start);
        g.x = p.x;
        g.y = p.y;
        it.t = p.t;
        it.el.style.setProperty("--t", p.t.toFixed(3));

        const o = it.overlay;
        o.style.display = p.bw > 0 && !p.done ? "block" : "none";
        o.style.transform = `translate(${it.left}px, ${it.top}px)`;
        o.style.width = `${Math.max(2, p.bw)}px`;
        o.style.height = `${Math.max(2, p.bh)}px`;
        o.style.opacity = String(p.fade);

        if (c) {
          c.style.translate = `${p.x - sx}px ${p.y - sy}px`;
          c.style.scale = p.pressed ? "0.86" : "1";
        }

        if (p.done) {
          finishNow(job.i);
          g.job = null;
          g.done++;
        }
      });

      raf = busy || pending.length ? requestAnimationFrame(frame) : 0;
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
          <svg width="16" height="18" viewBox="0 0 16 18">
            <path d="M1 1 L1 15 L5 11 L8 17 L10.5 16 L7.6 10 L13 10 Z" fill="var(--c)" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </>
  );
}
