import snapshot from "@/data/contributions.json";
import { parseCalendar, type Calendar } from "./contributions";

export const CONTRIBUTIONS_QUERY = `query { user(login: "TheLinc") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;

/** Live calendar from GitHub, refreshed daily. Any failure falls back to the committed snapshot. */
export async function getCalendar(): Promise<Calendar> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return fallback("GITHUB_TOKEN not set");
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: CONTRIBUTIONS_QUERY }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return fallback(`GitHub responded ${res.status}`);
    const json = await res.json();
    if (json.errors) return fallback("GitHub GraphQL errors");
    return parseCalendar(json, new Date().toISOString());
  } catch (err) {
    return fallback(err instanceof Error ? err.message : "fetch failed");
  }
}

function fallback(reason: string): Calendar {
  console.warn(`[contributions] using snapshot: ${reason}`);
  return snapshot as Calendar;
}
