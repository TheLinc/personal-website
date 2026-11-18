# Bust hero, lstack carousel and page reorder: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 3D stone-bust hero (neon shutter shades, horizontal mouse follow, scroll turn, hover "thought" spheres), the 8-card lstack carousel, and the new page order.

**Architecture:**
- The page stays a server component. Two new client islands:
  - `Bust` lazy-loads three.js and the scene module after first paint, over a static poster image.
  - `AgentRules` is a scroll-snap carousel.
- Pure maths lives in `lib/` with `node --test` tests:
  - scroll and turn easing;
  - the hover region;
  - sphere positions;
  - the shutter-slat extents;
  - the carousel index.
- The prototype at `C:/Users/Lincoln/AppData/Local/Temp/bust3d/index.html` is the reference implementation for the scene. Port it; don't redesign it.

**Tech stack:** Next.js 16 (App Router), React 19, Tailwind 4, three.js (new), pnpm, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-18-bust-hero-and-lstack-design.md`

## Global constraints

- **Page order:** Hero → How I ship with agents → Experience → Built this way (Cover Me, Open Room) → GitHub → Skills → Reviews → Hire Lincoln.
- **Likeness:** the bust is the only likeness. No photo and no cartoon character.
- **Shades:**
  - Neon yellow `#f4ff1f`, shutter style with 5 slats per lens.
  - `toneMapped = false` so the neon stays bright.
  - They stay on and never animate off.
- **Mouse follow:** horizontal only. `rig.rotation.x` is always 0.
- **Scroll turn:** yaw goes from -0.55 rad to 0 over the first 40% of progress. Progress is `clamp(scrollY / 520)`, eased with a factor of 0.14 per frame.
- **Hover thoughts:**
  - Six spheres: claude, vercel, react, ts, sql, aws.
  - They show when the pointer is over the bust with rig-local y > 0.58.
  - Each eases in with a stagger of 0.1.
- **Stone:** use the model's own texture, with roughness 0.85, metalness 0 and envMapIntensity 0.2.
  - Exposure 1.05.
  - Hemisphere light 0.7 (0xfff8ec / 0x6e5f49).
  - Key light 3.4 (0xfff3e2) at (-2.5, 3.5, 4).
- **Model:**
  - `public/assets/bust/bust.glb` (Draco, 737 KB).
  - Rotate -π/2 around Y, then normalise to a height of 2.2 and centre it.
- **Reduced motion:** show the poster only. No WebGL, no SVG draw-on animation, and the carousel still scrolls.
- **Never publish the phone number.** Copy stays plain; no new claims about Opinion System's AI work until Lincoln provides them.

## Review focus

1. **WebGL unavailable, or the model or decoder fails to load:** the poster stays visible, with no console errors that break the page.
2. **Touch devices:** there's no hover, so the bust follows scroll only. There's no horizontal overflow at 390px, and the text stays readable over the bust.
3. **Off screen:** once the hero is out of view the render loop stops (IntersectionObserver), and it resumes on return.
4. **Build animation (`BuildEngine`):** the carousel's horizontally off-screen cards must not get build overlays. Only the carousel container carries `data-build`. After a full scroll, the undone count is 0.
5. **Resize:** canvas size and camera aspect update with no stretching.

---

### Task 1: Motion maths

**Files:**
- Create: `lib/bustMotion.ts`
- Test: `lib/bustMotion.test.ts`

**Interfaces (produces):**
- `clamp01(v: number): number`
- `easeOut(t: number): number`, cubic `1-(1-t)^3`
- `scrollProgress(scrollY: number, span = 520): number`
- `approach(cur: number, target: number, k: number): number`, which returns `cur + (target-cur)*k`
- `yaw(p: number, mx: number): number`, which returns `-0.55*(1-easeOut(clamp01(p/0.4))) + mx*0.32`
- `isBrain(localY: number, threshold = 0.58): boolean`
- `thoughtPos(slot: [number,number,number], hoverT: number, i: number, t: number): { x: number; y: number; z: number; s: number }`
  - `e = easeOut(clamp01(hoverT*1.6 - i*0.1))`
  - `x = slot[0]*e + sin(t*0.9 + i*1.7)*0.025`
  - `y = 0.62 + (slot[1]-0.62)*e + sin(t*1.3 + i*1.7)*0.03`
  - `z = slot[2]*e`
  - `s = e`

- [ ] **Step 1: Write the failing tests.**
  - `yaw(0,0) === -0.55`
  - `yaw(1,0) === 0`
  - `yaw(0.4,0.5)` ≈ 0.16
  - `scrollProgress(-10) === 0`, `scrollProgress(260)` ≈ 0.5, `scrollProgress(9999) === 1`
  - `isBrain(0.7)` is true and `isBrain(0.5)` is false
  - `thoughtPos([.3,1,.2],0,0,0)` gives s = 0 and y = 0.62
  - At hoverT = 1 and i = 0, s = 1 and x is within 0.03 of 0.3.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL, because the module isn't found.
- [ ] **Step 3:** Implement `lib/bustMotion.ts`.
- [ ] **Step 4:** Run `pnpm test`. Expected: all pass.
- [ ] **Step 5:** Commit: `feat: bust motion maths`.

### Task 2: Shutter-shade geometry helpers

**Files:**
- Create: `lib/shades.ts`
- Test: `lib/shades.test.ts`

**Interfaces (produces):**
- `rowExtent(poly: {x:number;y:number}[], y: number): [number, number] | null` gives the leftmost and rightmost crossing of a horizontal line through a closed polygon, or null if there are fewer than 2 crossings.
- `bendPoint(x: number, z: number, R: number): [number, number]` returns `[(R+z)*sin(x/R), (R+z)*cos(x/R) - R]`.
- `LENS: [number, number][]` is the 11 lens points from the prototype: `[[0,.085],[.15,.09],[.265,.084],[.305,.052],[.302,0],[.272,-.058],[.205,-.088],[.11,-.086],[.05,-.064],[.022,-.024],[0,.035]]`.

- [ ] **Step 1: Failing tests.**
  - For a unit square, `rowExtent(square, 0.5)` deep-equals `[0,1]` and `rowExtent(square, 2)` is null.
  - `bendPoint(0,0,.38)` deep-equals `[0,0]`.
  - `bendPoint(.1,0,.38)[1]` is less than 0.
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `pnpm test`. Expected: PASS.
- [ ] **Step 5:** Commit: `feat: shutter-shade geometry helpers`.

### Task 3: three.js, assets and the bust scene

**Files:**
- Modify: `package.json` (add `three`, plus `@types/three` as a dev dependency)
- Create:
  - `public/assets/bust/bust.glb`, copied from `C:/Users/Lincoln/AppData/Local/Temp/bust3d/bustC-opt.glb`
  - `public/assets/bust/icons/{claude,vercel}.svg`, copied with `width="256" height="256"` added to the `<svg>`
  - `public/draco/`, copied from `node_modules/three/examples/jsm/libs/draco/gltf/`
  - `components/hero/bustScene.ts`

**Interfaces:**
- Consumes everything from Tasks 1 and 2.
- Produces `createBustScene(canvas: HTMLCanvasElement, opts: { onReady(): void }): { dispose(): void; setActive(on: boolean): void }`.

- [ ] **Step 1:** Run `pnpm add three` and `pnpm add -D @types/three`, then copy the assets.
- [ ] **Step 2:** Port the prototype into `createBustScene`. Keep these parts as they are:
  - lights, env map and renderer settings;
  - `buildShades` (using `LENS`, `rowExtent` and `bendPoint`);
  - thought spheres;
  - the raycast for the glasses' z position (eye line y = 0.5, gap 0.06, scale 1.05, R 0.38);
  - the hover raycast through `rig.worldToLocal`.

  Change these:
  - The tick reads `yaw`, `approach`, `scrollProgress`, `isBrain` and `thoughtPos`.
  - Load the model through DRACOLoader with `/draco/`.
  - Icons come from `/assets/icons/{react,ts,sql,aws}.png` and `/assets/bust/icons/{claude,vercel}.svg`.
  - Drop the prototype's `stoneify` and the slide/drop code.
  - The pointer listener goes on `window`, converting to NDC against `canvas.getBoundingClientRect()`.
  - `setActive(false)` cancels the requestAnimationFrame loop.
  - `dispose` removes listeners and disposes the renderer, geometries and textures.
- [ ] **Step 3:** Run `pnpm build`. Expected: compiles, with no type errors.
- [ ] **Step 4:** Commit: `feat: 3D bust scene with neon shutter shades and hover thoughts`.

### Task 4: Hero

**Files:**
- Create:
  - `components/hero/Bust.tsx` (client)
  - `public/assets/bust/poster.webp`
- Modify:
  - `app/page.tsx` (hero section)
  - `components/site/site.css` (hero bust placement)

**Interfaces:**
- Consumes `createBustScene`.
- `Bust` takes no props.

- [ ] **Step 1: Poster.** Load the prototype with the scroll position forced to 0 and the mouse centred. Screenshot only the canvas with a transparent background (`omitBackground`), then convert it to WebP with ffmpeg at quality 80.
- [ ] **Step 2: `Bust.tsx`.**
  - Render the poster `<img>` and a `<canvas>` stacked on top of each other.
  - In an effect, return early if reduced motion is on or WebGL is missing; then call `await import("./bustScene")` and `createBustScene`.
  - On `onReady`, fade the canvas in and hide the poster.
  - An IntersectionObserver on the wrapper calls `setActive`.
  - Both elements are `aria-hidden`, and the poster has `alt=""`.
- [ ] **Step 3: Hero layout.**
  - Make the h1 two lines, "Lincoln / Laylor", at `clamp(64px, 13vw, 150px)`, leading 0.86 and tracking -0.055em. The h1 sits on z-index 1.
  - The bust is absolutely positioned on z-index 2, sized so the hair overlaps the end of the "n" in "Lincoln" by about 20px at 1100px wide.
  - The tagline, intro and buttons sit on z-index 3.
  - Below the md breakpoint, the bust is smaller, top-right, behind the text (z-index 0) at 0.9 opacity.
- [ ] **Step 4: Logo chips.** Use Opinion System, lstack and Cover Me. lstack is a text-only chip in the `mono` class that links to https://github.com/TheLinc/lstack.
- [ ] **Step 5: Verify with Playwright** on `pnpm build && pnpm start -p 3100`:
  - At 1280px and 390px: no console errors and no horizontal overflow.
  - The canvas becomes visible.
  - Hovering the head shows the spheres; scrolling by 300 changes the yaw.
  - With reduced motion emulated, only the poster shows.
  - Save screenshots to `docs/proof/`.
- [ ] **Step 6:** Commit: `feat: 3D bust hero overlapping the name`.

### Task 5: lstack carousel

**Files:**
- Create:
  - `lib/carousel.ts`
  - `lib/carousel.test.ts`
  - `content/agentRules.tsx` (8 rules: `{ n, title, text, skill, art: ReactNode }`, copy and SVG paths exactly as in the approved mockup)
  - `components/site/AgentRules.tsx` (client)
- Modify: `components/site/site.css` (draw-on keyframes and the reduced-motion override)

**Interfaces:** `activeIndex(scrollLeft: number, step: number, count: number): number`, which is `min(count-1, max(0, round(scrollLeft/step)))` and returns 0 when `step` is 0.

- [ ] **Step 1: Failing tests.**
  - `activeIndex(0,246,8) === 0`
  - `activeIndex(250,246,8) === 1`
  - `activeIndex(99999,246,8) === 7`
  - `activeIndex(10,0,8) === 0`
- [ ] **Step 2:** Run `pnpm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `lib/carousel.ts`. Run `pnpm test`. Expected: PASS.
- [ ] **Step 4: `AgentRules`.**
  - Heading label "How I ship with agents", title "Eight rules my agents follow", and a subline linking `lstack` to the repo.
  - Arrow buttons with `aria-label`s, an `N / 8` counter and dots.
  - The row uses `overflow-x:auto` with `scroll-snap-type:x mandatory`, and cards are 232px wide.
  - An IntersectionObserver (root = row, threshold 0.6) adds `.on` to each card.
  - The SVGs use `pathLength=1` and the pen-filter displacement (`baseFrequency .022`, `scale 1.8`).
  - Only the section wrapper has `data-build="box"`.
  - With reduced motion, the strokes show fully drawn with no animation.
- [ ] **Step 5:** Commit: `feat: lstack carousel with line-drawn rules`.

### Task 6: Page reorder and "See it run"

**Files:**
- Modify:
  - `app/page.tsx`
  - `components/site/ProjectCard.tsx`

- [ ] **Step 1: Reorder the sections** in `app/page.tsx` to the order in Global constraints. The "Built this way" heading reads "Things I’ve built this way".
- [ ] **Step 2: "See it run."** In `ProjectCard`, wrap `children` in a native `<details>` element whose `<summary className="chip">` reads "See it run ▸". It's closed by default, and the demo only mounts its children when opened, through a small client wrapper that tracks the `open` state.
- [ ] **Step 3:** Run `pnpm test`, `pnpm lint` and `pnpm build`. Expected: all green.
- [ ] **Step 4: Verify with Playwright** at 1280px and 390px:
  - The section order matches.
  - "See it run" expands to the demo.
  - After scrolling to the bottom, the build engine's undone count is 0.
  - No overflow and no console errors.
  - Save screenshots to `docs/proof/`.
- [ ] **Step 5:** Commit: `feat: agents-first page order; demos behind See it run`.

### Task 7: Final check and local server

- [ ] Run `pnpm test`, `pnpm lint` and `pnpm build`. If the build fails while fetching Google fonts, retry once.
- [ ] Restart `pnpm start -p 3100` in the background. Kill any process still holding port 3100 first.
- [ ] Record a short proof clip: hover, scroll, carousel and "See it run". Save it to `docs/proof/`.
