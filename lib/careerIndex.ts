// Evidence for the career grep: each line is something Lincoln did, tagged with the skills it shows.
// Search is plain matching over tags, aliases and text. No model, so nothing can be invented.

export type Evidence = { path: string; logo?: string; text: string; tags: string[] };

export const EVIDENCE: Evidence[] = [
  { path: "opinion-system/portal", logo: "/assets/os.png", text: "Led a new client portal for 25k+ clients in Next.js, React, Zustand and React Query.", tags: ["nextjs", "react", "typescript", "zustand", "react query", "frontend", "leadership"] },
  { path: "opinion-system/ui", logo: "/assets/os.png", text: "Keyboard-accessible, localized (i18n) UI built from Figma designs with MUI theming.", tags: ["accessibility", "i18n", "mui", "figma", "frontend", "design"] },
  { path: "opinion-system/backend", logo: "/assets/os.png", text: "Full-stack B2B SaaS features on PHP/Symfony with cron jobs and Google and Facebook API integrations.", tags: ["php", "symfony", "backend", "rest apis", "integrations"] },
  { path: "opinion-system/pipelines", logo: "/assets/os.png", text: "Event-driven pipelines with Symfony Messenger and Mercure real-time streaming, with retries and failure handling.", tags: ["message queues", "real-time", "backend", "symfony"] },
  { path: "opinion-system/data", logo: "/assets/os.png", text: "Backend APIs, data models and SQL that cut average query time by 70%.", tags: ["sql", "mysql", "databases", "performance", "backend"] },
  { path: "opinion-system/aws", logo: "/assets/os.png", text: "AWS S3 for media storage and AWS Bedrock for AI-powered features.", tags: ["aws", "s3", "bedrock", "ai", "cloud"] },
  { path: "opinion-system/auth", logo: "/assets/os.png", text: "Authentication and role-based authorization enforced at the route level with middleware.", tags: ["auth", "security", "backend"] },
  { path: "opinion-system/billing", logo: "/assets/os.png", text: "Braintree payment processing and HubSpot CRM sync for customers, subscriptions and transactions.", tags: ["payments", "braintree", "billing", "hubspot", "integrations"] },
  { path: "opinion-system/team", logo: "/assets/os.png", text: "Code reviews, coding standards and mentoring; led delivery of React Native features for the mobile app.", tags: ["leadership", "mentoring", "code review", "react native", "mobile"] },
  { logo: "/assets/core.png", path: "core-manufacturing/frontend", text: "Founding frontend engineer: concept to production in 6 months with Next.js, TypeScript, shadcn/ui and Tailwind.", tags: ["nextjs", "typescript", "react", "tailwind", "shadcn", "frontend", "architecture"] },
  { logo: "/assets/core.png", path: "core-manufacturing/ai-chat", text: "Generative-UI chat that renders interfaces from structured LLM output.", tags: ["ai", "llm", "generative ui", "react"] },
  { logo: "/assets/core.png", path: "core-manufacturing/graph", text: "Schema-driven frontend that renders user-defined graph data models with dynamic properties.", tags: ["graph databases", "databases", "architecture", "frontend"] },
  { logo: "/assets/core.png", path: "core-manufacturing/design-system", text: "Built and maintained the design system and component library.", tags: ["design system", "components", "frontend", "design"] },
  { path: "cover-me/extension", logo: "/assets/coverme.png", text: "Chrome MV3 extension that tailors a resume and writes a cover letter in ~20 s; 200+ users on paid plans.", tags: ["chrome extension", "react", "typescript", "vite", "product"] },
  { path: "cover-me/backend", logo: "/assets/coverme.png", text: "Supabase Edge Functions proxy Claude; Postgres row-level security; resumes encrypted with AES-256-GCM.", tags: ["supabase", "postgresql", "claude", "deno", "security", "backend", "ai"] },
  { path: "cover-me/evals", logo: "/assets/coverme.png", text: "LLM eval harness of 32 synthetic resumes; CI runs it only on the prompts a pull request changes.", tags: ["llm evals", "ai", "testing", "ci", "github actions"] },
  { path: "cover-me/billing", logo: "/assets/coverme.png", text: "Stripe Checkout, webhooks and billing portal in a Next.js dashboard on Vercel.", tags: ["stripe", "payments", "billing", "nextjs", "vercel"] },
  { path: "cover-me/tests", logo: "/assets/coverme.png", text: "pgTAP tests for RLS and rate limits; Edge Function tests against a mock Claude server.", tags: ["testing", "pgtap", "postgresql", "security"] },
  { path: "cover-me/monitoring", logo: "/assets/coverme.png", text: "PostHog product analytics and Sentry error monitoring.", tags: ["posthog", "sentry", "observability"] },
  { path: "open-room/agents", logo: "/assets/openroom.png", text: "Electron app running several Claude Agent SDK sessions at once, one per named agent.", tags: ["electron", "claude agent sdk", "agents", "ai", "typescript", "node"] },
  { path: "open-room/voice", logo: "/assets/openroom.png", text: "On-device speech: Whisper for wake words, Moonshine for live dictation, neural text-to-speech.", tags: ["speech", "whisper", "moonshine", "onnx", "ai"] },
  { path: "open-room/mcp", logo: "/assets/openroom.png", text: "In-process MCP tool for speech; cut each agent from 73 inherited tools to only its configured ones.", tags: ["mcp", "agents", "ai", "performance"] },
  { path: "open-room/tests", logo: "/assets/openroom.png", text: "1,100+ Vitest tests and a per-tool permission model (ask, allow, deny).", tags: ["testing", "vitest", "security"] },
  { path: "gbatteries/sim", logo: "/assets/GBatteries.png", text: "Python hardware simulation app; Dockerized services on AWS ECS.", tags: ["python", "docker", "aws", "backend"] },
  { path: "trading-central/viz", logo: "/assets/trading-central.png", text: "Financial data visualisation in React and Angular with SVG.", tags: ["react", "angular", "data visualisation", "frontend"] },
];

/** Words people type, mapped to the tags they mean. */
const ALIASES: Record<string, string[]> = {
  ts: ["typescript"],
  js: ["typescript", "react", "node"],
  javascript: ["typescript", "react", "node"],
  next: ["nextjs"],
  "next.js": ["nextjs"],
  rn: ["react native"],
  postgres: ["postgresql"],
  sql: ["sql", "postgresql", "mysql"],
  db: ["databases", "sql", "postgresql"],
  database: ["databases", "sql", "postgresql"],
  llm: ["llm", "ai", "claude"],
  ml: ["ai"],
  openai: ["ai", "llm"],
  anthropic: ["claude", "claude agent sdk"],
  payment: ["payments"],
  test: ["testing"],
  tests: ["testing"],
  a11y: ["accessibility"],
  lead: ["leadership", "mentoring"],
  management: ["leadership", "mentoring"],
  cloud: ["aws", "vercel", "cloud"],
  "ci/cd": ["ci", "github actions"],
  devops: ["docker", "ci", "github actions", "aws"],
  ui: ["frontend", "design system", "react"],
  ux: ["accessibility", "design", "frontend"],
  agent: ["agents", "claude agent sdk"],
};

export type Hit = Evidence & { score: number };

const norm = (s: string) => s.toLowerCase().trim();

/** Evidence lines matching the query, best first. */
export function grep(query: string): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const terms = [q, ...(ALIASES[q] ?? [])];
  return EVIDENCE.map((e) => {
    let score = 0;
    for (const t of terms) {
      if (e.tags.some((tag) => tag === t)) score += 3;
      else if (e.tags.some((tag) => tag.startsWith(t) || (t.length > 3 && tag.includes(t)))) score += 2;
    }
    if (norm(e.text).includes(q)) score += 1;
    return { ...e, score };
  })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}

const ALL_TAGS = Array.from(new Set(EVIDENCE.flatMap((e) => e.tags)));

function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** Closest real skills for a query with no matches (typos like "typscript"). */
export function suggest(query: string): string[] {
  const q = norm(query);
  return ALL_TAGS.map((t) => [t, distance(q, t)] as const)
    .filter(([, d]) => d <= Math.max(2, Math.floor(q.length / 3)))
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([t]) => t);
}

export const SKILL_COUNT = ALL_TAGS.length;
