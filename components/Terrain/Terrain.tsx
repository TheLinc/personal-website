"use client";

import { Component, useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
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

/** Any 3D failure (chunk load, renderer construction) falls back to the 2D heatmap instead of taking down the page. */
class FallbackBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Terrain({ calendar }: { calendar: Calendar }) {
  const detected = useSyncExternalStore<Mode>(noop, detect, () => "pending");
  const [lost, setLost] = useState(false);
  const onFallback = useCallback(() => setLost(true), []);
  const mode = lost ? "2d" : detected;

  // On desktop the flat heatmap sits where the terrain would: right of the copy.
  const flat = (
    <div className="absolute inset-x-5 bottom-8 md:inset-x-auto md:bottom-24 md:right-10 md:w-[46%]">
      <Heatmap2D calendar={calendar} />
    </div>
  );
  if (mode === "3d")
    return (
      <FallbackBoundary fallback={flat}>
        <TerrainCanvas calendar={calendar} onFallback={onFallback} />
      </FallbackBoundary>
    );
  if (mode === "2d") return flat;
  return null;
}
