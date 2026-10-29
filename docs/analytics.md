# Anonymous game analytics

This collects aggregate game data separately from the Statistics menu's existing
browser-local records. Existing records are neither uploaded nor migrated.
No public stats page is added. Query the private Neon database to view totals.

## Enable collection

1. Connect a Neon Postgres database to the VelociDice project through Vercel
   Storage/Marketplace (or use an existing Neon database). Choose a plan and
   region appropriate to your account; database and Function usage have their own
   limits. No database is provisioned by this code.
2. Run `docs/analytics-schema.sql` in that database's SQL editor.
3. Set server-only `DATABASE_URL`, `GAME_ANALYTICS_ORIGIN` (the exact production
   origin, such as `https://velocidice.vercel.app`, without a trailing slash), and
   `GAME_ANALYTICS_ENABLED=true` in the project's **Production** environment.
   The integration may already supply `DATABASE_URL`; never copy it into a `VITE_`
   variable or commit it. Leave collection disabled in Preview and Development.
4. Deploy a new production build after setting the variables. The Vite build
   exposes only an enabled boolean, never database credentials. Both the browser
   and endpoint require Production plus the enabled flag. Localhost, Do Not Track,
   and Global Privacy Control disable browser reporting.
5. Complete one real game. Confirm POST `/api/game-events` returns 204, then query
   `SELECT * FROM game_result_totals;` and `SELECT * FROM match_result_totals;`.
   In computer mode, player1 means human and player2 means computer. Local mode
   uses seat winners; it is not included in a human-vs-computer win rate.

`npm run dev` and `npm run preview` serve the client only and never collect data.
The Vercel deployment serves the root `api/game-events.ts` Function. Without
configuration or the schema, analytics requests fail closed; play still works.

## Event semantics

- `game_started`: each real start, next game, or explicit restart. Going back to
  the menu does not create a start. A restart starts a fresh match.
- `game_completed`: each game reaching the target. Includes final scores,
  both seats' match wins, configuration and completed-turn count, including Farkles.
- `match_completed`: once a seat has the required match wins. One-game matches
  deliberately create both a game completion and match completion. Scores are
  the final game's scores; turns are cumulative across the match.

Only random per-game/per-match IDs and random event IDs are sent, along with
bounded enums and numbers. No player names, cookies, persistent player IDs,
IP addresses, user-agent strings, URLs or referrers are written to the database.
The host still processes network metadata to serve requests; this does not mean
the hosting platform receives no metadata. Tutorial practice never starts this
tracker. The tutorial's Start a game button starts a normal, countable game.
Any use of debug presets excludes the rest of that match. Developer controls
are absent in production, which is the only environment allowed to collect.

## Reliability and operations

The browser makes a best-effort request with one bounded retry on server/network
failure, retaining the event ID. Database uniqueness on event ID, game/kind and
match completion prevents duplicate rows. No persistent queue is kept. Blockers,
offline play, tab closure, privacy preferences and network loss can undercount.
Do not interpret starts minus completions as an exact abandonment metric.

The endpoint accepts only small, strictly validated JSON from the configured
origin and has no public read endpoint. Origin checks deter cross-site browser
submissions, but clients can forge results or origin headers. These are usage
statistics, not authoritative rankings. If abuse appears, add a Vercel Firewall
rate-limit rule for `/api/game-events`; no IP tracking database is required.

Database failures log only a generic diagnostic. Monitor Function errors for
`Game analytics write failed`, and turn off `GAME_ANALYTICS_ENABLED` then redeploy
to stop collection. Review usage and retention periodically. For example, after
exporting any aggregates you need, an owner can purge old event rows:

```sql
DELETE FROM game_events WHERE received_at < now() - interval '180 days';
```

This retention policy is manual; no scheduled deletion or paid service is created.

## References

- [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js)
- [Neon HTTP serverless driver](https://neon.com/docs/serverless/serverless-driver)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
