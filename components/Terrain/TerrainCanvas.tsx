"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { heightFor, maxCount, spikeWeek, type Calendar, type Day } from "@/lib/contributions";

const BG = 0x0b0b0a;
const ACCENT = new THREE.Color(0xff5b1f);
const BASE = new THREE.Color(0x24221f);
const ZERO = new THREE.Color(0x151413);
const HOVER = new THREE.Color(2.2, 2.1, 2.0);

/** Instance colour: dark warm grey rising to an over-bright accent so tall columns glow under tone mapping. */
function colourFor(count: number, max: number): THREE.Color {
  if (count === 0 || max === 0) return ZERO.clone();
  const t = Math.sqrt(count / max);
  // Most days stay dark; only the busiest columns light up.
  return BASE.clone().lerp(ACCENT, t * t).multiplyScalar(1 + 1.8 * t ** 3);
}

export default function TerrainCanvas({
  calendar,
  onFallback,
}: {
  calendar: Calendar;
  onFallback: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const tip = tipRef.current!;
    const callout = calloutRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const weeks = calendar.weeks;
    const W = weeks.length;
    const max = maxCount(calendar);
    const spike = spikeWeek(calendar);
    const cx = (W - 1) / 2;

    // ── Renderer, scene, camera ──────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(BG);
    wrap.prepend(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 26, 70);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xfff1e6, 1.6);
    key.position.set(18, 26, 14);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5b1f, 0.35);
    rim.position.set(-20, 8, -16);
    scene.add(rim);

    // ── Columns: one instanced mesh, one instance per day ────────
    const days: Day[] = [];
    const geometry = new THREE.BoxGeometry(0.86, 1, 0.86);
    geometry.translate(0, 0.5, 0); // grow from the ground up
    const material = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.15 });
    const count = weeks.reduce((n, w) => n + w.length, 0);
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const m = new THREE.Matrix4();
    const colours: THREE.Color[] = [];
    let i = 0;
    weeks.forEach((week, x) =>
      week.forEach((d, y) => {
        m.makeScale(1, heightFor(d.count, max), 1).setPosition(x - cx, 0, y - 3);
        mesh.setMatrixAt(i, m);
        const c = colourFor(d.count, max);
        colours.push(c);
        mesh.setColorAt(i, c);
        days.push(d);
        i++;
      }),
    );
    scene.add(mesh);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0x0e0e0d, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    // Spike anchor: top centre of the spike week's tallest column.
    const spikeTop =
      spike === null
        ? null
        : new THREE.Vector3(
            spike - cx,
            Math.max(...weeks[spike].map((d) => heightFor(d.count, max))) + 0.4,
            0,
          );

    // ── Camera path: start over the newest weeks, drift back through the year ─
    const newest = W - 1 - cx;
    const oldest = -cx + 8;
    const target = new THREE.Vector3();
    let progress = 0; // 0 = top of hero, 1 = hero scrolled away

    function placeCamera(t: number) {
      const x = newest - (newest - oldest) * progress - 6;
      const drift = reduced ? 0 : Math.sin(t / 4200) * 0.3;
      target.set(x, 0.4, 0);
      camera.position.set(x + 19 + drift, 11, 21 + drift);
      camera.lookAt(target);
    }

    function resize() {
      const { clientWidth: w, clientHeight: h } = wrap;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      // On wide screens push the terrain right, clear of the copy.
      if (w >= 1024) camera.setViewOffset(w, h, -w * 0.2, -h * 0.04, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    }

    const v = new THREE.Vector3();
    function placeCallout() {
      if (!callout || !spikeTop) return;
      v.copy(spikeTop).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95;
      callout.style.opacity = visible ? "1" : "0";
      callout.style.transform = `translate(${((v.x + 1) / 2) * wrap.clientWidth}px, ${((1 - v.y) / 2) * wrap.clientHeight}px)`;
    }

    // ── Hover: raycast the instanced mesh ────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = -1;
    function setHover(id: number) {
      if (id === hovered) return;
      if (hovered >= 0) mesh.setColorAt(hovered, colours[hovered]);
      if (id >= 0) mesh.setColorAt(id, HOVER);
      mesh.instanceColor!.needsUpdate = true;
      hovered = id;
      if (!running) render(performance.now());
    }
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(mesh)[0];
      const id = hit?.instanceId ?? -1;
      setHover(id);
      if (id >= 0) {
        const d = days[id];
        tip.textContent = `${d.date} · ${d.count} contribution${d.count === 1 ? "" : "s"}`;
        tip.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
        tip.style.opacity = "1";
      } else tip.style.opacity = "0";
    }
    function onLeave() {
      setHover(-1);
      tip.style.opacity = "0";
    }
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    // ── Loop: only while the hero is on screen and the tab is visible ─
    let raf = 0;
    let running = false;
    let onScreen = true;
    function render(t: number) {
      placeCamera(t);
      renderer.render(scene, camera);
      placeCallout();
    }
    function frame(t: number) {
      render(t);
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      const should = onScreen && !document.hidden && !reduced;
      if (should && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    io.observe(wrap);
    document.addEventListener("visibilitychange", sync);

    function onScroll() {
      const hero = wrap.parentElement!;
      progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
    }
    if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) render(performance.now());
    });
    ro.observe(wrap);

    function onLost(e: Event) {
      e.preventDefault();
      onFallback();
    }
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    resize();
    onScroll();
    render(performance.now());
    sync();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", onScroll);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      geometry.dispose();
      material.dispose();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [calendar, onFallback]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={tipRef}
        className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap border border-rule bg-bg/90 px-2 py-1 font-mono text-[11px] text-ink opacity-0"
      />
      {spikeWeek(calendar) !== null && (
        <Link
          ref={calloutRef}
          href="/agents"
          tabIndex={-1}
          className="absolute left-0 top-0 z-10 opacity-0 transition-opacity duration-300"
        >
          <span className="fig absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-accent">
            <span className="border border-accent/60 bg-bg/80 px-2 py-1">Fig. 2 — Parallel agents online →</span>
            <span className="h-10 w-px bg-accent/70" />
            <span className="size-1.5 rounded-full bg-accent" />
          </span>
        </Link>
      )}
    </div>
  );
}
