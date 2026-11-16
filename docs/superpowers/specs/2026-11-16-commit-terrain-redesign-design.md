# Commit Terrain: personal site redesign

## Intent

Lincoln attaches lincolnlaylor.com to job applications. The site is an artefact whose one job is to convince a hiring manager or engineer to hire him. Today it reads as a generic AI template (purple/cyan aurora blobs, letter-by-letter name reveal, cycling role ticker, gradient text). The redesign should make a reviewer stop and think "this person is serious": technically impressive (niche, real-data pieces like a GitHub heatmap), visually distinctive, and grounded in well-founded AI engineering knowledge.

Reviewers skim fast. **All content must be visible immediately.** The impressive parts reward exploration; nothing gates content behind an intro animation.

## Goals

- A signature hero nobody else can have: Lincoln's real GitHub contribution year rendered as a 3D terrain.
- Communicate existing content better: experience, projects, testimonials, contact.
- Add Open Room and Cover Me as flagship case studies, Core Manufacturing as experience.
- A separate `/agents` page documenting how Lincoln optimizes AI tooling: the `tackle` and `tackle-board` skills, which keep each agent's context small and scoped, avoiding scope creep and context bloat, so many agents run in parallel at scale.
- Stay fast: good Core Web Vitals, accessible, works on phones.

## Non-goals

- No AI chatbot ("Ask Lincoln"). Common, reads as slop.
- No intro sequence, loading screen, or self-building animation that delays content.
- No CMS. Content lives in TS data files in the repo.
- No blog.

## Anti-goals (failure even if it works)

- Looks AI-generated: gradient blobs, glassmorphism cards, emoji role tickers, generic "passionate developer" copy, heavy use of generated imagery.
- Reviewer has to wait or hunt to learn who Lincoln is and what he built.
- Terrain tanks performance or breaks on mobile.
- `/agents` reads as marketing fluff instead of an engineer's explanation with real mechanics.

## Approaches considered (decided)

1. **Plain three.js in one client component** — CHOSEN. One canvas, `InstancedMesh` of 365 columns, one light rig, scroll-linked camera, raycast hover. One new dependency (`three`), loaded only for the hero via `next/dynamic` with `ssr: false`.
2. React Three Fiber + drei — nicer React ergonomics but three extra deps for a single scene. Rejected: 3D should not spread across the site.
3. No WebGL (CSS 3D divs or a pre-rendered Higgsfield fly-over) — rejected: no real lighting, and video can't use live data or respond to hover, which kills the "it's real" effect.

## Decisions made with Lincoln

- Direction: **Commit Terrain** (3D GitHub terrain hero + engineering spec-sheet visual language). Rejected alternatives: site that builds itself via an agent workflow (too slow before content shows), "datasheet" joke concept, cinematic Higgsfield-heavy editorial.
- AI-tooling story lives on its own page `/agents` with graphics, not as the site's interaction model.
- Experience: Opinion System and Core Manufacturing in full (from resume); GBatteries, Trading Central, Canada Revenue Agency kept as condensed one-line entries.
- Projects: Open Room and Cover Me as flagship case studies. Mask Detection and NuViu Smart Cane kept in a small "earlier work" row. **Remove** Nilon, FollowIQ, Spotlight (and their images).
- Testimonials: keep all three (Arif Lalani, Mathieu Martel, Amélie Fontaine), restyled as short pull quotes. Quotes may be trimmed for length but not reworded.
- GitHub data includes private contribution counts; Lincoln will enable "Include private contributions" on his GitHub profile.
- Higgsfield (generative image/video, via MCP; account has ~270 credits, ~35 per 5 s video, ~0.25 per image) is used for one concept, **"The Model"** (spec below). Not used for project headers or `/agents` diagrams. The terrain is always real code, never generated.
- Project order: **Cover Me first, then Open Room.**
- Open Room's header visual reuses the pixel-art agent crew from Lincoln's Open Room marketing site (drawn in code, see below). Cover Me's header visual is a code-driven tailoring animation (builder's call, approved by Lincoln: "do what you want for Cover Me").
- Obsolete components, images and dependencies are deleted, not left behind.

## Content source of truth

`Lincoln_Master_Resume.pdf` (provided in the brainstorming session) plus the existing components. Copy below is the factual basis; final wording is the builder's, written plainly (no "passionate", no superlatives Lincoln didn't earn).

**Opinion System — Full Stack Developer, Feb 2023 – Present, Gatineau QC.** Led a new client portal for 25k+ clients (Next.js, React, Zustand, React Query); accessible, keyboard-navigable, i18n UI from Figma with MUI theming; full-stack B2B SaaS features on PHP/Symfony with cron jobs, Google and Facebook API integrations; event-driven async pipelines with Symfony Messenger and Mercure real-time streaming with retry/failure handling; backend APIs, DB models and SQL that cut average query time 70%; AWS S3 and Bedrock; auth and role-based route-level access control; code reviews, standards, mentoring in a tech-lead role; weekly release cadence; led React Native feature delivery for a team; Braintree payments and HubSpot CRM sync.

**Core Manufacturing — Founding Frontend Engineer (Contract), Oct 2025 – Apr 2026, Ottawa ON.** Owned frontend strategy, architecture, delivery; concept to production in 6 months. Next.js, React, TypeScript, shadcn/ui, Tailwind for manufacturing analytics and MES features. Generative-UI chat that renders interfaces from structured LLM output. Schema-driven frontend that renders user-defined graph data models. Next.js API routes abstracting graph-backend limits. Design system and component library.

**Condensed roles (one line each):** GBatteries — Full Stack Developer, 2022 (Python hardware simulation, Dockerized services on ECS, real-time socket servers). Trading Central — Software Developer, 2021 (React/Angular financial data viz, SVG). Canada Revenue Agency — IT Analyst & Developer, 2020 (data masking research, UFT test automation).

**Cover Me (flagship).** AI Chrome extension that writes cover letters and tailors resumes to a posting in ~20 s. Chrome Web Store, open source (MIT), 200+ registered users, paid Stripe subscriptions. Supabase backend (Edge Functions, Postgres RLS) proxying Claude with server-side usage limits; resumes encrypted at rest with AES-256-GCM. Tailoring matches ATS keywords without inventing experience, scores match /100 with gap analysis, writes back into the user's Word file. LLM eval harness: 32 synthetic resumes across 16 industries flagging invented skills, altered titles/dates and LLM-judge regressions; CI runs it only on prompts a PR changes. Server-side scraping for LinkedIn, Indeed, Greenhouse, Lever, Workday, Ashby with JSON-LD / ATS-selector / layout-heuristic fallback. Bring-your-own-key mode with locally encrypted key; click-only script injection instead of site-wide permissions. pgTAP for RLS and rate limits; Edge Function integration tests against a mock Claude server. Next.js dashboard on Vercel with Stripe Checkout/webhooks/portal, drag-and-drop application tracker, PostHog and Sentry. Tech: React, TS, Vite, Chrome MV3, Supabase, Postgres, Deno, Claude/OpenAI APIs, Stripe, Next.js, Vercel, PostHog, Sentry, Vitest, pgTAP, GitHub Actions.

**Open Room (flagship).** Electron desktop app running several named Claude Code agents at once, each a persistent Claude Agent SDK session with its own model, tool permissions, voice and workspace, addressed by voice or chat. Multi-process: main process owns agent state, React UI, overlay HUD, Node voice sidecar over JSON-RPC keeping native ONNX inference off the UI thread. On-device speech: Whisper STT, Silero VAD, AudioWorklet gate, custom wake words per agent name via phonetic matching (no model training). In-process MCP tool lets the model decide what to say aloud, via a priority speech bus with mid-sentence preemption and on-device neural TTS. Traced a 550 ms per-utterance TTS delay to Windows Defender rescanning PowerShell scripts; fixed so each is scanned once. Cut each agent from 73 inherited tools and 8 MCP servers to only its configured tools by disabling SDK settings inheritance. Resumable conversations, optional per-conversation git worktrees. Per-tool permission model (ask/allow/deny) with scoped deny rules and click-only approval; 1,100+ Vitest tests. Tech: TS, Electron, React, Node, Claude Agent SDK, MCP, Whisper, ONNX Runtime, Tailwind, Vitest, GitHub Actions.

**Links:** Open Room's primary link is `https://openroom.dev`; Cover Me's primary link is `https://cover-me.dev`. Secondary links: repos `github.com/TheLinc/open-room` and `github.com/TheLinc/cover-me` (both public), plus Cover Me's Chrome Web Store listing.

**Earlier work:** Mask Detection Model (existing copy, GitHub link). NuViu Smart Cane (existing copy).

**Education:** University of Ottawa, BASc Computer Engineering CO-OP, 2018–2023.

**Resume:** no PDF on the site (decided).

**Contact:** lincolnlaylor@gmail.com, github.com/TheLinc, linkedin.com/in/lincolnlaylor. Phone is NOT published on the site.

## Site structure

### `/` (home), in order

1. **Hero / Commit Terrain.** Full-viewport WebGL canvas. Name, one-line positioning (full-stack engineer who builds agentic AI tooling), primary links (Projects, `/agents`, Contact). No resume PDF link (decided: dropped). Text is real HTML over the canvas, rendered on the server, readable before WebGL loads.
2. **Selected work.** Cover Me, then Open Room, as case studies. Each opens with a moving header visual drawn in code:
   - **Cover Me — "Tailoring":** a job posting on one side with ATS keywords lighting up; on the other, resume lines rewriting to match (wording changes, no new experience appears), and a match score ticking up to a final value with gap items checking off. Loops slowly; static final frame under reduced motion. Content is illustrative sample text, not a real person's resume.
   - **Open Room — "The Crew":** the five pixel-art agents (Clawd, Bit, Terminal, Block, Loop) at their desks, screens lighting in turn as each agent works, a voice pill showing which one is speaking. Source: `F:\personal-projects\open-room-site` — copy `src/lib/crew.ts`, `crew-sprites.ts` (generated sprite grids), `crew-layers.ts`, `crew-faces.ts` and adapt `src/components/crew-desks.tsx` / `crew-face.tsx`. Keep the sprite data verbatim; restyle only what clashes with this site.
   Then each case study continues: Each: what it is in one sentence, 3–5 hard numbers pulled out as spec callouts (e.g. `550 ms → 0`, `73 → n tools`, `1,100+ tests`, `200+ users`, `32-resume eval set`), and an **animated architecture diagram** in SVG.
   - Open Room diagram: main process ⇄ React UI, ⇄ overlay HUD, ⇄ voice sidecar (JSON-RPC), sidecar → Whisper/VAD/TTS; small packets travel the edges.
   - Cover Me diagram: extension → Supabase Edge Function → Claude; Postgres RLS + AES-GCM store; Stripe; eval harness in CI.
   - Diagrams animate when scrolled into view; static under `prefers-reduced-motion`.
   - Then the "earlier work" row (Mask Detection, NuViu), visually minor.
3. **Experience.** Opinion System and Core Manufacturing in full; three condensed rows.
4. **Agents teaser.** One short block linking to `/agents`, with a small static preview of its main diagram.
5. **Testimonials.** Three pull quotes.
6. **Contact.** Email, GitHub, LinkedIn. Footer with build info (e.g. commit SHA and build date) as a spec-sheet detail.

Removed from today's site: Skills logo-pill grid (tech appears in context in case studies instead), custom cursor, aurora orbs, cycling role ticker, gradient name text, Swiper carousel. About section folds into the hero line and the case studies.

### `/agents`

An engineer's explanation of how Lincoln runs coding agents at scale, built around his two Claude Code skills:

- **The problem:** one long-running agent accumulates context (files read, dead ends, unrelated tickets). Larger context degrades agent performance and invites scope creep.
- **tackle:** one ticket → one agent in its own git worktree. The agent claims the ticket with a unique comment token (first claim wins, so parallel sessions can't double-claim), reads only the ticket and related work, runs an impact/blast-radius check, branches, posts its plan to the ticket, implements, tests with a subagent, files out-of-scope findings as follow-up tickets instead of expanding scope, opens a PR.
- **tackle-board:** orchestrator that never writes code. Reads a GitHub Project board, picks unblocked, non-conflicting Todo tickets by priority (blockers inherit the priority of what they block), launches one thread per ticket with at most N in flight (default 3, ~9 agents at peak counting tester and reviewer subagents), and refills slots as tickets leave In Progress.
- **Why it works:** small scoped context per agent, isolation via worktrees, scope creep turned into tickets, a hard concurrency cap.
- **Graphics (the main visual):** side-by-side scroll-driven diagram. Left: one agent whose context bar fills and degrades. Right: a board feeding tickets into N slots, each agent with a small, flat context bar, PRs coming out. Built in SVG/CSS, animated on scroll. Higgsfield may supply a supporting illustration or texture; the diagram itself is code.
- Mentions Open Room's 73 → configured-tools reduction as a second, concrete example of trimming context.
- Source material: `~/.claude/skills/tackle/SKILL.md` and `~/.claude/skills/tackle-board/SKILL.md` on Lincoln's machine (in this environment: `C:\Users\Lincoln\.claude-work\skills\`). Do not publish the skill files verbatim; describe the mechanics.

## The Commit Terrain (hero) spec

- **Data:** GitHub GraphQL `user(login: "TheLinc") { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount } } totalContributions } } }`, last 12 months. Fetched server-side at build time with `revalidate: 86400`. Token in env var `GITHUB_TOKEN` (read-only, no scopes needed for public calendar data). Adding it to the Vercel project is a plan step; Lincoln supplies the token. Until then the snapshot serves, and the snapshot script is documented in the README. A committed snapshot `data/contributions.json` is the fallback when the token is missing or the request fails; the build must never fail on GitHub. The snapshot is generated by a small script the builder writes.
- **Scene:** 53 × 7 grid (weeks × weekdays), one `InstancedMesh` of boxes; height scales with contribution count (sqrt or log scale so one huge day doesn't flatten the rest); zero days are a thin base tile. Dark ground, a lit-city-at-night feel: low ambient, one directional key light, column tops emissive in proportion to count. Restrained palette: near-black ground, one warm accent for high-activity columns. Not purple/cyan.
- **Real data shape (checked 2026-11-16):** 2,779 contributions in the last year, private counts already on. Nov 2025–Feb 2026 are zero; ~90% of activity is Sep–Nov 2026 (1,256 in October, peaks of 123/day); 229 of 366 days are zero. Window stays the last 12 months.
- **Framing (decided):** camera **opens on the recent spike** (today's end of the grid) and scroll drifts it **back** through the year. The spike gets a spec-sheet callout, e.g. `FIG. 1 — PARALLEL AGENTS ONLINE`, linking to `/agents`, so the jump reads as cause and effect (the tackle-board workflow), not padded commits. Place the callout at the first week where activity climbs; compute it from data (e.g. first week whose rolling count crosses a threshold), not a hard-coded date.
- **Motion:** slow idle drift; scroll moves the camera from the spike back toward the quiet start while the hero is on screen. No scroll-jacking: page scrolls normally.
- **Interaction:** hover (raycast on the instanced mesh) highlights a column and shows an HTML tooltip with date and contribution count. Lincoln's private repos mean we show counts only, not repo names or messages. Total contributions shown as a spec label.
- **Fallbacks:** `prefers-reduced-motion` → static camera, no drift. No WebGL or small/touch screens → a static 2D heatmap (SVG) of the same data, still styled. Text never depends on WebGL.
- **Performance:** `three` loaded via `next/dynamic({ ssr: false })` only on `/`; render loop paused when hero is off screen (`IntersectionObserver`) or tab hidden; device pixel ratio capped at 2.

## "The Model" (Higgsfield)

Made after the terrain is built, because it needs a render of it.

1. Render the real terrain (from the actual data) as a clean still from a 3/4 angle with the October spike in frame.
2. Higgsfield image model, with that render as reference: a photoreal physical object — Lincoln's commit year as a machined-aluminium architectural model on a dark studio plinth, spike rising like a skyline. Must keep the data's shape (column layout and relative heights) recognisable. Iterate on stills (cheap) until it does.
3. Higgsfield image-to-video from the approved still: slow, seamless orbit loop, ~5 s, no morphing of the columns.
4. Placement: closes the hero. As the user scrolls past the live terrain, it hands off to the physical model video, labelled `FIG. 0 — <total> CONTRIBUTIONS · SCALE 1 COLUMN : 1 DAY`. Video is muted, `playsinline`, lazy-loaded, poster = the still; reduced motion shows the still only. Compressed to web size (target under ~2 MB, webm + mp4).
5. A still also becomes the Open Graph / share image.

Quality bar: if it reads as "AI art" rather than product photography, ship the still only, or drop it. Budget: at most ~4 video generations total; Lincoln approves the still before any video is generated.

## Visual language

Engineering spec sheet. Monospace annotations, measurement/dimension lines, part-number-style labels (e.g. `FIG. 2 — OPEN ROOM PROCESS MAP`), thin rules, generous whitespace, very few colours (near-black and off-white plus one accent). Typography: keep JetBrains Mono for annotations; the builder picks the display/body pairing, avoiding the current Bricolage look if it reads template-y. Dark theme only; existing ThemeToggle is removed unless it costs nothing to keep.

Motion is purposeful: diagrams that explain, terrain that responds. No decorative floating elements.

## Constraints

- Existing stack: Next.js 16 (App Router), React 19, Tailwind 4, framer-motion already installed. Deployed on Vercel. Package manager: both `package-lock.json` and `pnpm-lock.yaml` exist; the builder picks one and deletes the other.
- One new runtime dependency: `three` (+ `@types/three` dev). Remove deps that become unused (`swiper`, `react-icons` if unused, `tailwindcss-animated` if unused).
- Keep SEO plumbing working: `layout.tsx` metadata and JSON-LD (update job title/description/knowsAbout to match new positioning), `opengraph-image.tsx`, `apple-icon.tsx`, `robots.ts`, `sitemap.ts` (add `/agents`).
- Accessibility: WCAG AA contrast, keyboard navigation, real headings, canvas is `aria-hidden` with the 2D/text equivalent available, reduced-motion respected.
- Mobile first-class: recruiters open links on phones.

## Left to the builder

- Exact copywriting (from the facts above), display/body fonts, accent colour, spacing system.
- Component structure and file layout; deleting obsolete components and images.
- Diagram styling and animation details.
- Height scale function and camera path tuning for the terrain.
