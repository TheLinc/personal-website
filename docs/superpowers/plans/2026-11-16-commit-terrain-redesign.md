# Commit Terrain Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild lincolnlaylor.com as the "Commit Terrain" site: a 3D GitHub-contribution hero, spec-sheet case studies (Cover Me, Open Room), experience, testimonials, and a `/agents` page on tackle / tackle-board.

**Architecture:** Next.js 16 App Router. `app/page.tsx` becomes a server component that fetches contribution data (daily ISR, committed snapshot fallback) and passes it to client islands: a three.js terrain loaded with `next/dynamic({ ssr: false })`, SVG diagrams, and two code-drawn header animations. All copy is server-rendered HTML; motion is progressive enhancement. Content lives in one typed data file.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, framer-motion (already installed), `three` (new), Node's built-in test runner for pure logic.

**Spec:** `docs/superpowers/specs/2026-11-16-commit-terrain-redesign-design.md` — read it first; it holds all copy facts and decisions.

## Global Constraints

- One new runtime dependency only: `three` (+ `@types/three` dev). Remove `swiper`, `react-icons`, `tailwindcss-animated` once unused.
- Package manager: **pnpm** (its lockfile is newer). Delete `package-lock.json`.
- No phone number anywhere. No resume PDF link.
- Project order: Cover Me first, then Open Room. Primary links `https://cover-me.dev`, `https://openroom.dev`; secondary `https://github.com/TheLinc/cover-me`, `https://github.com/TheLinc/open-room`.
- Removed entirely: Nilon, FollowIQ, Spotlight (and `public/images/projects/{nilon,followiq,spotlightV1,pipestream,sweetacularcookies,design}`, `website.png`, `github.png`), Skills grid, Cursor, ThemeToggle, TypingAnimation, LayoutCard, aurora orbs, gradient text, grain overlay, Swiper.
- Visual tokens (builder's call, pinned here so tasks agree): `--bg #0b0b0a`, `--ink #ecebe6`, `--muted rgba(236,235,230,.55)`, `--rule rgba(236,235,230,.12)`, `--accent #ff5b1f` (the only colour). Fonts via `next/font/google`: display **Archivo** (variable, `axes: ['wdth']`, headings at `font-stretch: 75%`), body **IBM Plex Sans** (400/500), mono **JetBrains Mono** (400/500). No purple, no cyan, no gradients.
- Spec-sheet labels use the form `FIG. n — UPPERCASE TITLE` in mono, 11px, letter-spacing .08em.
- Every animation respects `prefers-reduced-motion: reduce` (static final frame). Canvas and decorative SVGs are `aria-hidden`.
- Copy: plain, factual, from the spec's content section. No "passionate", no superlatives, testimonials trimmed but never reworded.
- Pure-logic tests run with `node --test` on `.ts` files (Node 22.23 strips types). Tested modules import siblings with explicit `.ts` extensions and import nothing from `@/` or packages; enable `allowImportingTsExtensions` in tsconfig.

## Review Focus

1. **GitHub unavailable** (no `GITHUB_TOKEN`, 401, rate limit, network error, malformed JSON) → page renders from `data/contributions.json`; build never fails. Test in Task 2.
2. **Degenerate data** (all zeros; a single 500-count day) → finite heights, no NaN, spike callout omitted when there is no spike. Test in Task 2.
3. **No WebGL / touch / narrow viewport (<768px)** → 2D SVG heatmap of the same data, no three.js download. Verified in Task 3.
4. **Reduced motion** → terrain camera static, diagrams and header animations show final frame. Verified in Tasks 3, 5, 6, 7, 9.
5. **Off-screen or hidden tab** → terrain render loop stops (no rAF while hero not intersecting or `document.hidden`); WebGL context lost → swap to 2D heatmap. Verified in Task 3.

---

### Task 1: Clean slate, tokens, shell

**Files:**
- Delete: `components/{About,Cursor,Skills,ThemeToggle,TypingAnimation,LayoutCard,Project,Projects}/`, `css/socials.css`, `public/images/{webDevSkills,backendDevSkills,cloudSkills,containerizationSkills,designSkills,personalAcheivements,about}/`, the project image dirs listed in Global Constraints, `package-lock.json`
- Modify: `app/globals.css` (replace tokens, drop grain/aurora/gradient utilities), `app/layout.tsx` (fonts, remove grain div), `app/page.tsx` (server component skeleton), `components/Nav/Nav.tsx` (restyle: name left, links Work · Experience · /agents · Contact right, mono), `package.json` (deps, `"test": "node --test \"lib/**/*.test.ts\""`), `tsconfig.json` (`allowImportingTsExtensions: true`)

- [ ] **Step 1:** Delete the listed files/dirs; `pnpm remove swiper react-icons tailwindcss-animated`; `pnpm add three`; `pnpm add -D @types/three`.
- [ ] **Step 2:** Replace tokens and fonts per Global Constraints. `page.tsx` renders `<Nav/>` and empty `<main>` sections with ids `work`, `experience`, `agents`, `testimonials`, `contact` (filled by later tasks). Remove `"use client"` from `page.tsx`.
- [ ] **Step 3:** Run `pnpm build && pnpm lint`. Expected: both succeed; `grep -rE "swiper|react-icons|8b5cf6|22d3ee" app components` returns nothing.
- [ ] **Step 4:** Commit `chore: clear template styling and obsolete sections`.

### Task 2: Contribution data

**Files:**
- Create: `lib/contributions.ts`, `lib/contributions.test.ts`, `lib/github.ts`, `data/contributions.json`, `scripts/snapshot-contributions.mjs`
- Modify: `README.md` (how to refresh snapshot; `GITHUB_TOKEN` env), `.env.example` (create: `GITHUB_TOKEN=`)

**Interfaces (Produces):**
```ts
// lib/contributions.ts — pure, no imports
export type Day = { date: string; count: number };          // date = YYYY-MM-DD
export type Calendar = { total: number; fetchedAt: string; weeks: Day[][] }; // weeks oldest→newest, ≤7 days each
export function parseCalendar(json: unknown, fetchedAt: string): Calendar;  // throws on bad shape
export function heightFor(count: number, max: number): number;              // 0 → 0.08; else 0.25 + 4*sqrt(count/max); always finite
export function maxCount(cal: Calendar): number;                            // 0 if empty
export function spikeWeek(cal: Calendar): number | null;                    // first week index whose weekly sum ≥ 0.5 × max weekly sum; null if max weekly sum is 0
// lib/github.ts — server only
export async function getCalendar(): Promise<Calendar>; // GraphQL, falls back to data/contributions.json on ANY failure
```
GraphQL query (POST `https://api.github.com/graphql`, `Authorization: bearer ${GITHUB_TOKEN}`, `next: { revalidate: 86400 }`):
`query { user(login: "TheLinc") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`

- [ ] **Step 1: Write failing tests** in `lib/contributions.test.ts` (`import { test } from 'node:test'; import assert from 'node:assert/strict'; import {...} from './contributions.ts'`):
  - `parseCalendar` maps a 2-week GraphQL fixture to `{ total, fetchedAt, weeks: [[{date,count}...]] }`; throws on `{}` and on `{ data: { user: null } }`.
  - `heightFor(0, 10) === 0.08`; `heightFor(10, 10) === 4.25`; `heightFor(5, 0)` and `heightFor(0, 0)` are finite.
  - all-zero calendar: `maxCount === 0`, `spikeWeek === null`.
  - weekly sums `[0,0,1,2,30,40,10]` → `spikeWeek === 4`; single 500-count day in week 2, rest zero → `spikeWeek === 2`.
- [ ] **Step 2:** `pnpm test` → FAIL (module missing).
- [ ] **Step 3:** Implement `lib/contributions.ts` per the interface.
- [ ] **Step 4:** `pnpm test` → PASS.
- [ ] **Step 5:** Implement `lib/github.ts`: no token, non-200, `errors` in body, or `parseCalendar` throw → `console.warn` once and return the snapshot (`import snapshot from '@/data/contributions.json'`). Write `scripts/snapshot-contributions.mjs` (uses `GITHUB_TOKEN` or `gh auth token`, writes normalized `Calendar` JSON). Run it to produce `data/contributions.json`; expect `total` ≈ 2,779.
- [ ] **Step 6:** Verify fallback: `GITHUB_TOKEN= pnpm build` succeeds and logs the warning.
- [ ] **Step 7:** Commit `feat: contribution calendar data with snapshot fallback`.

### Task 3: Commit Terrain hero

**Files:**
- Create: `components/Terrain/TerrainCanvas.tsx` (client, three.js), `components/Terrain/Terrain.tsx` (client wrapper: capability check + `dynamic(() => import('./TerrainCanvas'), { ssr: false })`), `components/Terrain/Heatmap2D.tsx` (SVG fallback, server-safe), `components/Hero/Hero.tsx` (replace)
- Modify: `app/page.tsx` (`export const revalidate = 86400`; `const cal = await getCalendar()`; pass to `<Hero calendar={cal} />`)

**Interfaces:** Consumes `Calendar`, `heightFor`, `maxCount`, `spikeWeek` from Task 2. Produces `<Hero calendar={Calendar} />` and `<Heatmap2D calendar={Calendar} className?: string />` (reused by Task 9 and Task 10).

- [ ] **Step 1: Hero copy (server HTML, over the canvas):** name as h1; one line "Full-stack engineer. I build agentic AI tooling and the products around it." (wording may be tightened); links Work · /agents · Contact; spec labels `FIG. 1 — CONTRIBUTIONS, LAST 12 MONTHS` and total count. Spike callout `PARALLEL AGENTS ONLINE →` linking `/agents`, rendered only when `spikeWeek !== null`.
- [ ] **Step 2: Scene:** one `InstancedMesh` (BoxGeometry, `MeshStandardMaterial`), 53×7 grid at 1 unit pitch, 0.86 footprint; height from `heightFor`; top emissive intensity ∝ count/max in `--accent`, zero days dark grey base tiles. Low `AmbientLight` + one `DirectionalLight`. Background `--bg`, fog to fade the far end. DPR `min(devicePixelRatio, 2)`.
- [ ] **Step 3: Camera:** initial framing on the last ~10 weeks (the spike) from a 3/4 elevated angle; hero-scroll progress 0→1 moves camera target from newest week toward oldest (lerp along x); idle drift ±0.3 units sinusoidal. No scroll-jacking. Spike callout is an HTML element positioned each frame by projecting the spike week's top centre to screen.
- [ ] **Step 4: Hover:** raycast instanced mesh on pointermove → highlight instance (colour swap) + HTML tooltip `YYYY-MM-DD · n contributions`. No tooltip on touch.
- [ ] **Step 5: Lifecycle and fallbacks** (Review Focus 3–5): `Terrain.tsx` renders `<Heatmap2D>` when `matchMedia('(pointer: coarse)')` or width < 768 or no WebGL (`canvas.getContext('webgl2')` null) — three.js chunk not requested in that case. In canvas: `IntersectionObserver` + `visibilitychange` start/stop the rAF loop; `webglcontextlost` → switch to `<Heatmap2D>`; reduced motion → no drift, no scroll camera. Dispose geometry/material/renderer on unmount.
- [ ] **Step 6: Verify in a browser** (`pnpm dev`; Playwright MCP): desktop 1440×900 screenshot shows lit terrain with spike callout; hover shows tooltip; 390×844 shows 2D heatmap and network panel has no three chunk; emulate `prefers-reduced-motion` → camera still; scroll hero off-screen → `requestAnimationFrame` count stops (check via `browser_evaluate`). Disable JS → name, line, links still visible.
- [ ] **Step 7:** Commit `feat: commit terrain hero`.

### Task 4: Content data

**Files:** Create `content/site.ts`.

**Interfaces (Produces):**
```ts
export type Callout = { value: string; label: string };              // e.g. { value: "550 ms → 0", label: "TTS delay traced to Defender rescans" }
export type Link = { label: string; href: string };
export type Project = { id: "cover-me" | "open-room"; name: string; oneLiner: string; callouts: Callout[]; body: string[]; tech: string[]; links: Link[] };
export type Role = { company: string; role: string; period: string; place: string; points: string[] };
export type ShortRole = { company: string; role: string; year: string; line: string };
export type Quote = { text: string; name: string; role: string };
export const projects: Project[];      // [coverMe, openRoom] in that order
export const earlierWork: { name: string; line: string; href?: string }[]; // Mask Detection (href github.com/TheLinc/Mask_Detection_ML), NuViu
export const roles: Role[];            // Opinion System, Core Manufacturing
export const shortRoles: ShortRole[];  // GBatteries 2022, Trading Central 2021, CRA 2020
export const quotes: Quote[];          // Arif Lalani, Mathieu Martel, Amélie Fontaine
export const contact: Link[];          // email, GitHub, LinkedIn
```
- [ ] **Step 1:** Fill from the spec's content section and the existing `components/Testimonials/Testimonials.tsx`. Cover Me callouts include `~20 s`, `200+ users`, `32 resumes / 16 industries`, `AES-256-GCM`; Open Room callouts include `550 ms → 0`, `73 tools → only configured`, `1,100+ tests`, `on-device Whisper + TTS`. 4–6 `body` bullets each. Roles: 5–7 points each.
- [ ] **Step 2:** `pnpm exec tsc --noEmit` passes; `grep -n "647" content/site.ts` returns nothing.
- [ ] **Step 3:** Commit `feat: site content data`.

### Task 5: Case study layout and architecture diagrams

**Files:** Create `components/Work/Work.tsx`, `components/Work/CaseStudy.tsx`, `components/Work/ArchDiagram.tsx`, `components/Work/diagrams.ts`. Modify `app/page.tsx` (render `<Work/>` in `#work`).

**Interfaces:**
```ts
// diagrams.ts
export type DNode = { id: string; label: string; x: number; y: number; w?: number };  // viewBox 0 0 800 360
export type DEdge = { from: string; to: string; label?: string };                   // label e.g. "JSON-RPC"
export type Diagram = { fig: string; nodes: DNode[]; edges: DEdge[] };
export const coverMeDiagram: Diagram;   // Extension → Edge Function → Claude; Edge Function ↔ Postgres (RLS, AES-GCM); Dashboard ↔ Stripe; CI → Eval harness (32 resumes)
export const openRoomDiagram: Diagram;  // Main process ↔ React UI, ↔ Overlay HUD, ↔ Voice sidecar (JSON-RPC); sidecar → Whisper / VAD / TTS
// ArchDiagram.tsx
export function ArchDiagram(props: { diagram: Diagram }): JSX.Element; // client
// CaseStudy.tsx
export function CaseStudy(props: { project: Project; header: React.ReactNode; diagram: Diagram; index: number }): JSX.Element;
```
- [ ] **Step 1:** `ArchDiagram`: hairline rect nodes with mono labels, orthogonal edges, small accent squares travelling each edge (`<animateMotion>` or CSS offset-path) starting when in view (`useInView` from framer-motion, once). Reduced motion → no packets.
- [ ] **Step 2:** `CaseStudy`: `FIG.` label, name, one-liner, header slot, callouts as a measurement-ruled grid, body bullets, diagram, tech list in mono, links (primary first). `Work` maps `projects` with headers from Tasks 6/7 (use a placeholder `<div>` until those land), then the "Earlier work" row.
- [ ] **Step 3:** Browser check at 1440 and 390 widths: Cover Me appears above Open Room; packets move; no horizontal overflow at 390.
- [ ] **Step 4:** Commit `feat: case studies with architecture diagrams`.

### Task 6: Cover Me "Tailoring" header

**Files:** Create `components/Work/Tailoring.tsx` (client). Modify `components/Work/Work.tsx` (use it as Cover Me header).

- [ ] **Step 1:** Two panes. Left: a short sample job posting (illustrative company "Northwind", ~6 lines); 5 ATS keywords highlight one by one in `--accent`. Right: 4 sample resume lines; after each keyword lights, the matching line crossfades to reworded text containing that keyword (same experience, new wording). Bottom: score counter 61 → 92 in mono, and 3 gap items checking off. Cycle ≈ 9 s, pause 2 s on final, loop. Sample text constants live in the component.
- [ ] **Step 2:** Pause when off-screen (`useInView`); reduced motion → final state static. `aria-hidden` with an sr-only sentence describing it.
- [ ] **Step 3:** Browser check: animation loops; at 390 width panes stack.
- [ ] **Step 4:** Commit `feat: cover me tailoring animation`.

### Task 7: Open Room "Crew" header

**Files:** Create `components/Crew/crew.ts`, `crew-sprites.ts`, `crew-layers.ts` (copied verbatim from `F:\personal-projects\open-room-site\src\lib\`, `@/lib/` imports rewritten to relative), `components/Crew/CrewDesks.tsx` (from `src/components/crew-desks.tsx`), `components/Crew/crew.css` (the `.crew-*` rules and keyframes plus their reduced-motion block from open-room-site `src/app/globals.css` lines ~80–140 and ~320–335), `components/Crew/CrewScene.tsx` (client). Modify `components/Work/Work.tsx`.

**Interfaces:** Consumes `CrewDesks({ desks: Record<CrewId, DeskStatus>, glancing: CrewId | null })` as copied. Produces `<CrewScene />`.

- [ ] **Step 1:** Copy files; keep sprite data byte-identical (`diff` against source shows only import-path changes).
- [ ] **Step 2:** `CrewScene`: cycles desks so 2–3 agents are `working` at once, one turns `done` every ~1.6 s and another starts; a mono voice pill below names the agent that last finished (`Bit: tests pass.`-style short lines, 5 constants). Pixel-scaled SVG (`image-rendering: pixelated`, width 100%). Pause off-screen; reduced motion → static mixed state.
- [ ] **Step 3:** Browser check: five crew visible, hands type, screens change.
- [ ] **Step 4:** Commit `feat: open room crew animation`.

### Task 8: Experience, agents teaser, testimonials, contact, footer

**Files:** Replace `components/Experience/Experience.tsx`, `components/Testimonials/Testimonials.tsx`, `components/Contact/Contact.tsx`; create `components/AgentsTeaser/AgentsTeaser.tsx`, `components/Footer/Footer.tsx`. Delete `components/Experience/ExperienceCard.*`, `public/images/social/*.tsx` if unused. Modify `app/page.tsx`.

- [ ] **Step 1:** Experience: two full `roles` as ruled spec rows (period left column in mono, company/role/points right), then `shortRoles` as a compact table. Company logos optional; drop if they clash.
- [ ] **Step 2:** AgentsTeaser: `FIG. — CONTEXT PER AGENT` one-paragraph pitch + small static version of Task 9's diagram (import its static frame) + link to `/agents`.
- [ ] **Step 3:** Testimonials: three pull quotes, large display type, name/role in mono. Contact: email, GitHub, LinkedIn as large links. Footer: `BUILD ${process.env.VERCEL_GIT_COMMIT_SHA?.slice(0,7) ?? 'local'} · ${build date}`, © 2026.
- [ ] **Step 4:** `pnpm build`; browser check of full home page at 1440 and 390; keyboard Tab order reaches every link with a visible focus ring.
- [ ] **Step 5:** Commit `feat: experience, testimonials, contact, footer`.

### Task 9: `/agents` page

**Files:** Create `app/agents/page.tsx` (server, own `metadata`), `components/Agents/ContextDiagram.tsx` (client), `components/Agents/Steps.tsx`.

**Interfaces:** Produces `ContextDiagram` and `ContextDiagramStatic` (final frame, no JS needed) used by Task 8.

- [ ] **Step 1: Copy sections** (from the spec's `/agents` section; source skills at `C:\Users\Lincoln\.claude-work\skills\tackle\SKILL.md` and `tackle-board\SKILL.md`; describe, don't paste): The problem · tackle (claim with unique token, first claim wins; read only ticket + related; impact check; branch `<type>/<ID>-slug`; plan posted to ticket; implement; test via subagent; out-of-scope → follow-up tickets; PR) · tackle-board (orchestrator never writes code; unblocked non-conflicting Todo tickets by priority, blockers inherit priority; N slots, default 3, ~9 agents at peak; refill when a ticket leaves In Progress) · Why it works · Open Room's 73 → configured tools as a second example.
- [ ] **Step 2: ContextDiagram** (scroll-driven via framer-motion `useScroll` on its section): left lane, one agent with a context bar filling 0→100% across tickets, bar shifts to accent and "quality" sparkline sags; right lane, board of 9 ticket cards flowing into 3 slots, each slot's context bar stays ≤25% and resets per ticket, PR chips exit. Reduced motion → static final frame.
- [ ] **Step 3:** Nav link to `/agents` works; page reads fully without JS; browser check 1440/390.
- [ ] **Step 4:** Commit `feat: agents page`.

### Task 10: SEO and metadata

**Files:** Modify `app/layout.tsx` (title "Lincoln Laylor — Full-Stack Engineer, Agentic AI Tooling", description from hero line, JSON-LD `jobTitle`/`knowsAbout` incl. Claude Agent SDK, MCP, LLM evals, Next.js, TypeScript; `worksFor` omitted), `app/sitemap.ts` (add `/agents`), `app/opengraph-image.tsx` (drop `runtime = "edge"`; spec-sheet layout: name, line, a mini heatmap drawn from the snapshot as divs; replaced by The Model still in Task 11 if approved), `app/apple-icon.tsx` (restyle to tokens).

- [ ] **Step 1:** Make the changes.
- [ ] **Step 2:** `pnpm build`; open `/opengraph-image` and `/sitemap.xml` in the browser; JSON-LD parses (`JSON.parse` of the script tag in `browser_evaluate`).
- [ ] **Step 3:** Commit `chore: metadata, sitemap, og image`.

### Task 11: "The Model" (Higgsfield) — has a user checkpoint

**Files:** Create `public/model/model-still.jpg`, `public/model/model-loop.webm`, `public/model/model-loop.mp4`, `components/Hero/ModelFigure.tsx`. Modify `components/Hero/Hero.tsx` (append figure), optionally `app/opengraph-image.tsx`.

- [ ] **Step 1:** Screenshot the terrain (Playwright, 1600×900, 3/4 angle with spike in frame, tooltip hidden). Upload via `media_upload` → curl PUT → `media_confirm`.
- [ ] **Step 2:** `generate_image` (`gpt_image_2_6`, reference = upload) with a prompt for a photoreal machined-aluminium architectural model of the grid on a dark studio plinth, soft key light, shallow depth of field, column layout and relative heights preserved. Up to ~8 stills.
- [ ] **Step 3: STOP — show the best still to Lincoln and wait for approval.** No video credits before approval.
- [ ] **Step 4:** `generate_video` (`seedance_2_5`, 5 s, 16:9, image-to-video from the approved still): slow orbit, no column morphing. Max 4 video generations total (~140 credits); preflight with `get_cost`.
- [ ] **Step 5:** `ffmpeg` to webm (VP9) + mp4 (H.264), 1280 wide, muted, ≤2 MB each; still to JPEG ≤200 KB.
- [ ] **Step 6:** `ModelFigure`: `<video muted loop playsInline preload="none" poster=...>` lazy-started when in view; reduced motion → still only; label `FIG. 0 — {total} CONTRIBUTIONS · SCALE 1 COLUMN : 1 DAY`. If quality bar not met, ship still only or skip — tell Lincoln which.
- [ ] **Step 7:** Commit `feat: the model figure`.

### Task 12: Final verification

- [ ] **Step 1:** `pnpm test && pnpm lint && pnpm build` all pass.
- [ ] **Step 2:** Lighthouse (Chrome DevTools or `npx lighthouse http://localhost:3000 --preset=desktop` against `pnpm start`): Performance ≥ 85 mobile, Accessibility ≥ 95. Record numbers.
- [ ] **Step 3:** Re-run Review Focus 1–5 checks end to end.
- [ ] **Step 4:** `grep -rniE "nilon|followiq|spotlight|647|swiper" app components content lib public --include=*` returns nothing.
- [ ] **Step 5:** Note for Lincoln: add `GITHUB_TOKEN` to the Vercel project (Production + Preview).
