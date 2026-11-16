"use client";

// Open Room's desktop app, recreated: the crew perched on the window's top
// edge, the window playing the hero script beneath them. Ported from the
// open-room-site hero. Plays once when scrolled into view and rests on the
// finished conversation; reduced motion gets that final frame straight away.

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Geist, Geist_Mono } from "next/font/google";
import { CrewDesks, DESKS_H, DESKS_W } from "@/components/Crew/CrewDesks";
import "@/components/Crew/crew.css";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { AppWindow } from "./AppWindow";
import { heroStateAt, heroStill, type HeroState } from "./hero-script";

const sans = Geist({ variable: "--font-or-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-or-geist-mono", subsets: ["latin"] });

/** Below this width the whole drawing is laid out at this width and scaled down. */
const MIN_W = 480;
const STILL = heroStill();
const NARRATION =
  "Example: you say hey Bit, run the tests. Bit starts working in its own folder. You ask Block about the CI pipeline while Bit works; Block checks, then asks permission to run the deploy command, and you allow it once. Bit reports that the tests passed. You ask Terminal what Block changed, and it asks whether you want the diff. Block reports that staging is live.";

function same<T>(a: T, b: T) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function OpenRoomProduct({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef, { once: true, amount: 0.35 });
  const [run, setRun] = useState(0);
  const [live, setLive] = useState<HeroState>(() => heroStateAt(0));
  const [fit, setFit] = useState({ scale: 1, height: 0 });

  // One clock, started on first sight and again on replay. Re-renders only
  // when the script's state changes, and stops once the script has ended.
  useEffect(() => {
    if (reduced || !inView) return;
    const start = performance.now();
    let last: HeroState | null = null;
    let raf = 0;
    const tick = (now: number) => {
      const next = heroStateAt(now - start);
      if (!last || !same(last, next)) {
        last = next;
        setLive(next);
      }
      if (!next.ended) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, inView, run]);

  // Fit: at MIN_W and up the window lays itself out (container queries);
  // narrower, it renders at MIN_W and scales down to the available width.
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const ro = new ResizeObserver(() => {
      const scale = Math.min(1, outer.clientWidth / MIN_W);
      setFit({ scale, height: inner.offsetHeight * scale });
    });
    ro.observe(outer);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const state = reduced ? STILL : live;
  const scaled = fit.scale < 1;

  return (
    <div className={`${sans.variable} ${mono.variable} font-or-sans text-or-ink ${className}`}>
      <div ref={outerRef} className="overflow-x-clip" style={{ height: scaled ? fit.height : undefined }}>
        <div
          ref={innerRef}
          style={
            scaled
              ? { width: MIN_W, transform: `scale(${fit.scale})`, transformOrigin: "top left" }
              : undefined
          }
        >
          <div
            className="relative z-[2] mx-auto -mb-[10px] w-[min(560px,80%)]"
            style={{
              aspectRatio: `${DESKS_W} / ${DESKS_H}`,
              filter: "drop-shadow(0 6px 0 rgb(0 0 0 / 0.06))",
            }}
          >
            <CrewDesks desks={state.desks} glancing={state.glancing} className="block h-full w-full" />
          </div>
          <div role="img" aria-label={NARRATION}>
            <div aria-hidden="true">
              <AppWindow state={state} />
            </div>
          </div>
        </div>
      </div>
      {reduced ? null : (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className={`font-or-mono text-[12px] text-or-muted transition-colors hover:text-or-ink ${state.ended ? "" : "invisible"}`}
          >
            <span aria-hidden="true">↻</span> Replay
          </button>
        </div>
      )}
    </div>
  );
}
