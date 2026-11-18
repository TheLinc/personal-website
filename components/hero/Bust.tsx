"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

// A still of the bust shows at once; the live 3D scene loads after the page and fades in over it.
// Reduced motion, no WebGL, or a failed load: the still simply stays.
export default function Bust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!document.createElement("canvas").getContext("webgl2")) return;
    const canvas = canvasRef.current!;
    let dead = false;
    let scene: { dispose(): void; setActive(on: boolean): void } | undefined;
    let io: IntersectionObserver | undefined;
    import("./bustScene")
      .then(({ createBustScene }) => {
        if (dead) return;
        scene = createBustScene(canvas, { onReady: () => setLive(true) });
        io = new IntersectionObserver(([e]) => scene?.setActive(e.isIntersecting));
        io.observe(canvas);
      })
      .catch(() => {});
    return () => {
      dead = true;
      io?.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <div className="hero-bust" aria-hidden="true">
      <img src="/assets/bust/poster.webp" alt="" className={live ? "opacity-0" : ""} />
      <canvas ref={canvasRef} className={live ? "" : "opacity-0"} />
    </div>
  );
}
