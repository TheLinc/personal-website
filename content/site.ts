// All site copy. Facts come from the resume and the design spec; keep it plain.

export type Callout = { value: string; label: string };
export type Link = { label: string; href: string };
export type Project = {
  id: "cover-me" | "open-room";
  name: string;
  oneLiner: string;
  callouts: Callout[];
  body: string[];
  tech: string[];
  links: Link[];
};
export type Role = { company: string; role: string; period: string; place: string; points: string[] };
export type ShortRole = { company: string; role: string; year: string; line: string };
export type Quote = { text: string; name: string; role: string };

export const projects: Project[] = [
  {
    id: "cover-me",
    name: "Cover Me",
    oneLiner:
      "A Chrome extension that writes a cover letter and tailors your resume to a job posting in about 20 seconds.",
    callouts: [
      { value: "~20 s", label: "posting → tailored resume + cover letter" },
      { value: "200+", label: "registered users, paid Stripe plans" },
      { value: "32 × 16", label: "synthetic resumes × industries in the eval set" },
      { value: "AES-256-GCM", label: "resumes encrypted at rest" },
    ],
    body: [
      "Tailoring rewrites wording and skills to match a posting's ATS keywords without inventing experience, scores the match out of 100 with a gap analysis, and writes the result back into the user's own Word file.",
      "Supabase backend: Edge Functions proxy Claude, Postgres row-level security, usage limits enforced server-side.",
      "An LLM eval harness flags invented skills, altered titles or dates, and LLM-judge score regressions. CI runs it only on the prompts a pull request changes.",
      "Job-posting scraping lives on the server, so fixes for LinkedIn, Indeed, Greenhouse, Lever, Workday and Ashby ship without a store review, with JSON-LD, ATS-selector and layout-heuristic fallbacks for any other careers page.",
      "A free bring-your-own-key mode calls Claude or OpenAI straight from the browser with a locally encrypted key; the extension injects scripts only on click instead of asking for site-wide permissions.",
      "pgTAP tests for RLS and rate limits, Edge Function integration tests against a mock Claude server, and a deploy script that runs every test and dry-runs migrations first.",
    ],
    tech: [
      "React", "TypeScript", "Chrome MV3", "Supabase", "Postgres", "Deno", "Claude API", "OpenAI API",
      "Stripe", "Next.js", "Vercel", "PostHog", "Sentry", "Vitest", "pgTAP", "GitHub Actions",
    ],
    links: [
      { label: "cover-me.dev", href: "https://cover-me.dev" },
      { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/cover-me-ai-resume-tailor/bpbnopjgjbimdjjdolhkgimllbgamgpi" },
      { label: "Source (MIT)", href: "https://github.com/TheLinc/cover-me" },
    ],
  },
  {
    id: "open-room",
    name: "Open Room",
    oneLiner:
      "A desktop app for running several named Claude Code agents at once, each with its own model, permissions, voice and workspace, addressed by voice or chat.",
    callouts: [
      { value: "550 ms → 0", label: "per-utterance TTS delay, traced to Defender rescans" },
      { value: "73 → n", label: "inherited tools cut to each agent's configured set" },
      { value: "1,100+", label: "Vitest tests on core logic" },
      { value: "On-device", label: "Whisper STT, Silero VAD, neural TTS" },
    ],
    body: [
      "Each agent is a persistent Claude Agent SDK session. Conversations resume, and optional per-conversation git worktrees keep concurrent agents out of the same checkout.",
      "Electron with a main process that owns agent state, a React UI, an overlay HUD, and a Node voice sidecar over JSON-RPC that keeps native ONNX inference off the UI thread.",
      "Custom wake words for any agent name, using phonetic matching instead of model training, behind an AudioWorklet gate.",
      "Agents get an in-process MCP tool to decide what to say aloud, routed through a priority speech bus with mid-sentence preemption.",
      "Disabling SDK settings inheritance cut each agent from 73 inherited tools and 8 MCP servers to only its configured tools, and removed per-turn server startup.",
      "A per-tool permission model (ask, allow, deny) with scoped deny rules and click-only approval.",
    ],
    tech: [
      "TypeScript", "Electron", "React", "Node.js", "Claude Agent SDK", "MCP", "Whisper",
      "ONNX Runtime", "Tailwind CSS", "Vitest", "GitHub Actions",
    ],
    links: [
      { label: "openroom.dev", href: "https://openroom.dev" },
      { label: "Source", href: "https://github.com/TheLinc/open-room" },
    ],
  },
];

export const earlierWork: { name: string; line: string; href?: string }[] = [
  {
    name: "Mask Detection Model",
    line: "Real-time mask detection with TensorFlow, Keras and scikit-learn.",
    href: "https://github.com/TheLinc/Mask_Detection_ML",
  },
  {
    name: "NuViu Smart Cane",
    line: "IoT cane with ultrasonic sensors and an NVIDIA Jetson that detects obstacles, reads signs and speaks to the user.",
  },
];

export const roles: Role[] = [
  {
    company: "Opinion System",
    role: "Full Stack Developer",
    period: "Feb 2023 — Present",
    place: "Gatineau, QC",
    points: [
      "Led a new client portal serving 25k+ clients: Next.js, React, Zustand and React Query, keyboard-accessible and localized.",
      "Full-stack features for a B2B SaaS platform on PHP (Symfony): cron jobs, Google and Facebook API integrations, AWS S3 and Bedrock.",
      "Event-driven pipelines with Symfony Messenger and Mercure for real-time streaming, with structured failure handling and retries.",
      "Backend APIs, data models and SQL that cut average query time by 70% on high-volume client datasets.",
      "Braintree payments and HubSpot CRM sync for customer, subscription and transaction data.",
      "Role-based authorization enforced at the route level.",
      "Tech-lead duties: code reviews, standards, mentoring, ticket breakdowns for a React Native team, weekly releases.",
    ],
  },
  {
    company: "Core Manufacturing",
    role: "Founding Frontend Engineer (Contract)",
    period: "Oct 2025 — Apr 2026",
    place: "Ottawa, ON",
    points: [
      "Owned frontend strategy, architecture and delivery; took the product from concept to production in 6 months.",
      "Next.js, React, TypeScript, shadcn/ui and Tailwind for manufacturing analytics and MES features.",
      "A generative-UI chat that renders interfaces from structured LLM output.",
      "A schema-driven frontend that renders user-defined graph data models with dynamic properties and relationships.",
      "Next.js API routes that hid graph-backend limits behind frontend-friendly APIs.",
      "The design system and component library the rest of the app is built from.",
    ],
  },
];

export const shortRoles: ShortRole[] = [
  { company: "GBatteries", role: "Full Stack Developer", year: "2022", line: "Python hardware simulation, Dockerized services on ECS, real-time socket servers." },
  { company: "Trading Central", role: "Software Developer", year: "2021", line: "React and Angular financial data visualization with SVG." },
  { company: "Canada Revenue Agency", role: "IT Analyst & Developer", year: "2020", line: "Data masking research and UFT test automation." },
];

export const education = { school: "University of Ottawa", degree: "BASc, Computer Engineering (Co-op)", years: "2018 — 2023" };

export const quotes: Quote[] = [
  {
    text: "Lincoln quickly understands challenges and always comes forward with thoughtful solutions that improve both the product and the team’s workflow. I’ve seen him grow from a front-end developer into a confident full stack leader.",
    name: "Arif Lalani",
    role: "Lead UI/UX Designer, Opinion System",
  },
  {
    text: "Lincoln consistently demonstrates strong technical skills, ownership, and a collaborative mindset. He’s reliable, adaptable, and someone I trust to deliver high-quality work on challenging problems.",
    name: "Mathieu Martel",
    role: "Senior Software Developer, Opinion System",
  },
  {
    text: "Lincoln translated our Figma designs into pixel-perfect React components faster than anyone I've worked with. He also flagged a data-flow issue in the REST integration that would have been a headache to debug later.",
    name: "Amélie Fontaine",
    role: "Lead Developer, Trading Central",
  },
];

export const contact: Link[] = [
  { label: "lincolnlaylor@gmail.com", href: "mailto:lincolnlaylor@gmail.com" },
  { label: "github.com/TheLinc", href: "https://github.com/TheLinc" },
  { label: "linkedin.com/in/lincolnlaylor", href: "https://www.linkedin.com/in/lincolnlaylor/" },
];
