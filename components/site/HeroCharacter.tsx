"use client";

// Lincoln's character in the hero. Waves once on load (calling the agents in), then loops typing.
// Each agent action sends a small spark up from the laptop.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Spark = { id: number; color: string; dx: number };

export default function HeroCharacter({ wave, loop }: { wave?: string; loop?: string }) {
  const reduced = useReducedMotion();
  const waveRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"wave" | "loop">("wave");
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Hand off from the one-time wave to the typing loop without a gap.
  useEffect(() => {
    const w = waveRef.current;
    if (!w) return;
    const onEnd = () => {
      loopRef.current?.play().catch(() => {});
      setPhase("loop");
    };
    w.addEventListener("ended", onEnd);
    return () => w.removeEventListener("ended", onEnd);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let id = 0;
    const on = (e: Event) => {
      const { color } = (e as CustomEvent).detail;
      const spark = { id: id++, color, dx: Math.round((Math.random() - 0.5) * 60) };
      setSparks((s) => [...s.slice(-8), spark]);
      setTimeout(() => setSparks((s) => s.filter((x) => x.id !== spark.id)), 1200);
    };
    window.addEventListener("site-log", on);
    return () => window.removeEventListener("site-log", on);
  }, [reduced]);

  const media = "absolute inset-0 h-full w-full object-contain mix-blend-multiply";
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] select-none" aria-hidden="true" data-hero-character>
      {reduced || !wave ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={reduced ? "/assets/me-typing.jpg" : "/assets/me-wave.jpg"} alt="" className={media} />
      ) : (
        <>
          <video ref={waveRef} className={media} src={wave} poster="/assets/me-wave.jpg" autoPlay muted playsInline preload="auto" style={{ opacity: phase === "wave" ? 1 : 0 }} />
          {loop ? (
            <video ref={loopRef} className={media} src={loop} poster="/assets/me-typing.jpg" muted loop playsInline preload="auto" style={{ opacity: phase === "loop" ? 1 : 0 }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/assets/me-typing.jpg" alt="" className={media} style={{ opacity: phase === "loop" ? 1 : 0 }} />
          )}
        </>
      )}
      {/* Calls the agents in; BuildEngine times the orbiting dots to this. */}
      {!reduced && (
        // Sits in the empty space left of his face (face starts ~33% across; mouth ~34% down), tail pointing at his mouth.
        <p className="hero-bubble absolute top-[15%] right-[66%] z-10 w-max max-w-[min(168px,30vw)] rounded-2xl border border-[#e8e3da] bg-white px-2.5 py-1.5 text-[12px] leading-snug sm:px-3 sm:py-2 sm:text-[13px] font-semibold shadow-[0_10px_24px_-14px_rgba(40,30,10,0.45)]">
          Ok agents,<br /> let’s get building!
          <span aria-hidden className="absolute -right-[5px] bottom-3 size-2.5 rotate-[-45deg] border-r border-b border-[#e8e3da] bg-white" />
        </p>
      )}
      {/* Sparks rise from the laptop (about 33% across, 47% down in the frame). */}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="spark absolute size-2 rounded-full"
          style={{ left: "33%", top: "45%", background: s.color, ["--dx" as string]: `${s.dx}px`, boxShadow: `0 0 10px ${s.color}` }}
        />
      ))}
    </div>
  );
}
