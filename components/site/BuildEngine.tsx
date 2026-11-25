"use client";

// "Agents build the page as you scroll". Agent cursors build the first few [data-build] elements
// the reader reaches, or lands on after a #link, driving each one's --t from 0 to 1. The rest fade
// in on their own.

import { useEffect, useRef } from "react";
import { arrival } from "@/lib/buildQueue";

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
// How far each agent's path bows sideways, as a share of the trip.
const ARC = [0.2, -0.16, 0.12, -0.24];
const SPEED = [1, 0.82, 1.18, 0.92];
const MAX_ACTIVE = 2;
// The agents build the first few things you see, once. Everything after that fades in by itself,
// so the page never makes a reader wait for a cursor.
const AGENT_JOBS = 3;
const QUIET_AFTER = 1800; // ms a job may wait for an agent before it fades in by itself
const PRESS = 140;
const STILL_MS = 120; // how long the page must be still before a jump to a #link counts as landed
const WORK: Record<Kind, number> = { box: 650, text: 900, image: 550, data: 1500, check: 550 };
const SETTLE = 420;

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

    // A fake mouse pointer looks out of place on a touch screen, so there everything just fades in.
    let budget = window.matchMedia("(pointer: fine)").matches ? AGENT_JOBS : 0;

    function measure() {
      const range = document.createRange();
      const textEdges: [HTMLElement, string, string][] = [];
      items.forEach((it) => {
        const box = it.el.getBoundingClientRect();
        let r = box;
        if (it.kind === "text") {
          range.selectNodeContents(it.el);
          const tr = range.getBoundingClientRect();
          if (tr.width > 0) r = tr;
          textEdges.push([it.el, `${r.left - box.left}px`, `${r.width}px`]);
        }
        it.top = r.top + window.scrollY;
        it.left = r.left + window.scrollX;
        it.w = r.width;
        it.h = r.height;
      });
      // Written after every read, so the reads don't force a style recalc each.
      textEdges.forEach(([el, x0, w]) => {
        el.style.setProperty("--tx0", x0);
        el.style.setProperty("--tw", w);
      });
    }

    const agents: Agent[] = COLORS.map(() => ({ x: 0, y: 0, seen: false, job: null, done: 0 }));
    const pending: number[] = [];
    const queued = new Map<number, number>(); // item → when it became work
    let raf = 0;
    let lastY = window.scrollY;
    let movedAt = 0;
    let jumping = location.hash !== "";
    let jumpAt = performance.now();

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

    function pose(a: number, job: Job, elapsed: number): Pose {
      const it = items[job.i];
      const sweep = it.kind === "text" || it.kind === "data";
      const work = WORK[it.kind] / SPEED[a];
      const lineY = it.top + Math.min(it.h * 0.5, 22);
      const x0 = it.left;
      const y0 = sweep ? lineY : it.top;
      const p: Pose = { x: x0, y: y0, t: 0, bw: 0, bh: 0, fade: 1, pressed: false, done: false };

      if (elapsed < job.travel) {
        const q = inOut(elapsed / job.travel);
        const dx = x0 - job.fromX;
        const dy = y0 - job.fromY;
        const bow = Math.sin(Math.PI * q) * ARC[a];
        p.x = job.fromX + dx * q - dy * bow;
        p.y = job.fromY + dy * q + dx * bow;
        p.fade = 0;
        return p;
      }
      elapsed -= job.travel;
      p.pressed = true;
      if (elapsed < PRESS) {
        p.bw = 2;
        p.bh = sweep ? it.h : 2;
        return p;
      }
      elapsed -= PRESS;
      if (elapsed < work) {
        const q = elapsed / work;
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
      elapsed -= work;
      p.pressed = false;
      const q = clamp(elapsed / SETTLE);
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
      if (sy !== lastY) movedAt = now;
      lastY = sy;
      if (jumping && now - Math.max(movedAt, jumpAt) >= STILL_MS) jumping = false;
      let busy = false;

      items.forEach((it, i) => {
        if (it.t >= 1 || queued.has(i)) return;
        const what = arrival(it.top - sy, it.h, vh, budget - pending.length, jumping);
        if (what === "wait") return;
        queued.set(i, now);
        if (what === "finish") finishNow(i);
        else if (what === "agent") pending.push(i);
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

      while (!jumping && pending.length && agents.filter((g) => g.job).length < MAX_ACTIVE) {
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
          // A smooth scroll to a #link passes sections on the way; a job dropped before the cursor
          // got there goes back, so the agents still build where the reader lands.
          if (now - job.start < job.travel) budget++;
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

      raf = busy || jumping || pending.length ? requestAnimationFrame(frame) : 0;
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.('a[href^="#"]')) return;
      jumping = true;
      jumpAt = performance.now();
      kick();
    };
    // The reader took over the scroll, so whatever they pass is being read, not jumped past.
    const endJump = () => {
      jumping = false;
    };
    const readerInput = ["wheel", "touchstart", "keydown"] as const;

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
    document.addEventListener("click", onClick);
    readerInput.forEach((t) => window.addEventListener(t, endJump, { passive: true }));
    window.addEventListener("resize", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      document.removeEventListener("click", onClick);
      readerInput.forEach((t) => window.removeEventListener(t, endJump));
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
