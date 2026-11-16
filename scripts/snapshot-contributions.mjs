// Refresh data/contributions.json, the fallback used when GitHub is unreachable.
// Usage: GITHUB_TOKEN=... node scripts/snapshot-contributions.mjs  (falls back to `gh auth token`)
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const query = `query { user(login: "TheLinc") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
const token = process.env.GITHUB_TOKEN || execSync("gh auth token").toString().trim();

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});
const json = await res.json();
const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
if (!res.ok || !cal) throw new Error(`Bad response: ${res.status} ${JSON.stringify(json).slice(0, 200)}`);

const out = {
  total: cal.totalContributions,
  fetchedAt: new Date().toISOString(),
  weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
};
writeFileSync(new URL("../data/contributions.json", import.meta.url), JSON.stringify(out) + "\n");
console.log(`wrote ${out.weeks.length} weeks, ${out.total} contributions`);
