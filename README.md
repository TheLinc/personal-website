# lincolnlaylor.com

Next.js 16 site. `pnpm dev` to run, `pnpm test` for logic tests, `pnpm lint`, `pnpm build`.

## GitHub contribution data

The hero terrain is drawn from GitHub's contribution calendar for `TheLinc`.

- In production it's fetched at build time and refreshed daily (ISR). Set `GITHUB_TOKEN` (a read-only token; no scopes needed) in the Vercel project.
- If the token is missing or GitHub fails, the site uses `data/contributions.json`. Refresh that snapshot with:

```bash
node scripts/snapshot-contributions.mjs   # uses GITHUB_TOKEN, or `gh auth token`
```
