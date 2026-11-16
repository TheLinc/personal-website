"use client";

// framework icons shoot up from the section's bottom corners, fall into a pile behind
// the career window, and can be grabbed and thrown into each other.

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { GRAVITY, settled, step, wakeAll, type Body } from "@/lib/physics";

const ICONS: [string, string][] = [
  ["react.png", "React"], ["nextjs.png", "Next.js"], ["ts.png", "TypeScript"], ["node.png", "Node.js"],
  ["claude.svg", "Claude"], ["tailwind.png", "Tailwind CSS"], ["postgresql.svg", "PostgreSQL"], ["stripe.svg", "Stripe"],
  ["supabase.png", "Supabase"], ["aws.png", "AWS"], ["docker.png", "Docker"], ["vercel.svg", "Vercel"],
  ["electron.svg", "Electron"], ["mui.svg", "MUI"], ["expo.png", "Expo"], ["symfony.png", "Symfony"],
  ["python.png", "Python"], ["sql.png", "SQL"], ["js.png", "JavaScript"], ["angular.png", "Angular"],
  ["firebase.png", "Firebase"], ["git.png", "Git"], ["figma.png", "Figma"],
];
const DT = 1 / 120;

export default function IconPile() {
  const layerRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const layer = layerRef.current!;
    // Span the full visible page width (not 100vw, which includes the scrollbar).
    function fit() {
      const parent = layer.parentElement!.getBoundingClientRect();
      layer.style.left = `${-parent.left}px`;
      layer.style.width = `${document.documentElement.clientWidth}px`;
    }
    fit();
    let w = layer.clientWidth;
    let h = layer.clientHeight;
    const r = w < 640 ? 20 : 27;
    layer.style.setProperty("--d", `${r * 2}px`);
    const bodies: Body[] = ICONS.map((_, i) => ({ x: i % 2 ? w - r : r, y: h - r, vx: 0, vy: 0, r, angle: 0, held: false, live: false, still: 0 }));
    let raf = 0;
    let last = 0;
    let acc = 0;
    const timers: number[] = [];

    function draw() {
      bodies.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        el.style.opacity = b.live ? "1" : "0";
        el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px) rotate(${b.angle}rad)`;
      });
    }
    function frame(now: number) {
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      while (acc >= DT) {
        step(bodies, DT, w, h);
        acc -= DT;
      }
      if (bodies.some((b) => b.held)) wakeAll(bodies);
      draw();
      const waiting = bodies.some((b) => !b.live);
      raf = waiting || !settled(bodies) ? requestAnimationFrame(frame) : 0;
    }
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    // Launch alternately from the bottom-left and bottom-right corners, arcing inward.
    function launch(b: Body, i: number) {
      const left = i % 2 === 0;
      const up = Math.sqrt(2 * GRAVITY * h * (0.75 + ((i * 37) % 30) / 100));
      b.x = left ? b.r : w - b.r;
      b.y = h - b.r;
      b.vx = (left ? 1 : -1) * (w / 1000) * (180 + ((i * 53) % 420));
      b.vy = -up;
      b.live = true;
      b.still = 0;
    }

    if (reduced) {
      // Already landed: simulate the whole fall up front and show the final pile.
      bodies.forEach(launch);
      for (let n = 0; n < 120 * 8 && !(n > 120 && settled(bodies)); n++) step(bodies, DT, w, h);
      draw();
      return;
    }

    draw();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        bodies.forEach((b, i) =>
          timers.push(
            window.setTimeout(() => {
              launch(b, i);
              kick();
            }, 140 * i),
          ),
        );
      },
      { threshold: 0.35 },
    );
    io.observe(layer);

    const ro = new ResizeObserver(() => {
      fit();
      w = layer.clientWidth;
      h = layer.clientHeight;
      wakeAll(bodies);
      kick();
    });
    ro.observe(layer);
    ro.observe(document.documentElement);

    // Grab and throw. Velocity comes from the last few pointer moves.
    const cleanups = els.current.map((el, i) => {
      if (!el) return () => {};
      const b = bodies[i];
      let px = 0, py = 0, pt = 0;
      const down = (e: PointerEvent) => {
        if (!b.live) return;
        el.setPointerCapture(e.pointerId);
        b.held = true;
        b.vx = b.vy = 0;
        px = e.clientX;
        py = e.clientY;
        pt = performance.now();
        wakeAll(bodies);
        kick();
      };
      const move = (e: PointerEvent) => {
        if (!b.held) return;
        const now = performance.now();
        const dt = Math.max(1, now - pt) / 1000;
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        b.x = Math.min(w - b.r, Math.max(b.r, b.x + dx));
        b.y = Math.min(h - b.r, b.y + dy);
        b.vx = b.vx * 0.5 + (dx / dt) * 0.5;
        b.vy = b.vy * 0.5 + (dy / dt) * 0.5;
        px = e.clientX;
        py = e.clientY;
        pt = now;
        kick();
      };
      const up = () => {
        if (!b.held) return;
        b.held = false;
        const max = 3500;
        b.vx = Math.max(-max, Math.min(max, b.vx));
        b.vy = Math.max(-max, Math.min(max, b.vy));
        wakeAll(bodies);
        kick();
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      return () => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      io.disconnect();
      ro.disconnect();
      cleanups.forEach((c) => c());
    };
  }, [reduced]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-y-0 z-0"
      style={{ overflowX: "clip" }}
      aria-hidden="true"
    >
      {ICONS.map(([file, name], i) => (
        <div
          key={file}
          ref={(el) => {
            els.current[i] = el;
          }}
          title={name}
          className="icon-body absolute left-0 top-0 grid place-items-center rounded-full border border-[#e8e3da] bg-white opacity-0 shadow-[0_6px_14px_-8px_rgba(40,30,10,0.45)]"
          style={{ width: "var(--d)", height: "var(--d)", pointerEvents: reduced ? "none" : "auto" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/assets/icons/${file}`} alt="" draggable={false} className="pointer-events-none size-[58%] object-contain" />
        </div>
      ))}
    </div>
  );
}
