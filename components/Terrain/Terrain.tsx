"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import type { Calendar } from "@/lib/contributions";
import Heatmap2D from "./Heatmap2D";

const TerrainCanvas = dynamic(() => import("./TerrainCanvas"), { ssr: false });

type Mode = "pending" | "3d" | "2d";

let cached: Mode | null = null;
/** 3D only on wide, mouse-driven screens with WebGL2. Checked once per page load. */
function detect(): Mode {
  if (cached) return cached;
  const narrow = window.innerWidth < 768;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const gl = !narrow && !coarse && !!document.createElement("canvas").getContext("webgl2");
  cached = gl ? "3d" : "2d";
  return cached;
}
const noop = () => () => {};

export default function Terrain({ calendar }: { calendar: Calendar }) {
  const detected = useSyncExternalStore<Mode>(noop, detect, () => "pending");
  const [lost, setLost] = useState(false);
  const onFallback = useCallback(() => setLost(true), []);
  const mode = lost ? "2d" : detected;

  if (mode === "3d") return <TerrainCanvas calendar={calendar} onFallback={onFallback} />;
  if (mode === "2d")
    return (
      <div className="absolute inset-x-5 bottom-8 md:inset-x-10">
        <Heatmap2D calendar={calendar} />
      </div>
    );
  return null;
}
