# TieTheKnot Subscription

TieTheKnot is a wedding-planning platform with a Planner, Invitation Studio, public RSVP pages, and a server-controlled API.

## Applications

- `apps/planner` — the authenticated wedding planner.
- `apps/invitation-studio` — invitation design, guest links, and public RSVPs.
- `apps/api` — Express API for authentication, authorization, invitations, media, subscriptions, and webhooks.
- `supabase/migrations` — version-controlled Postgres schema.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install` from this repository root.
3. Create separate local environment files from each application's `.env.example`.
4. Apply `supabase/migrations/202610160001_initial_schema.sql` to a non-production Supabase project.
5. Run `npm run dev:api`, `npm run dev:planner`, and `npm run dev:studio` in separate terminals.

Use `npm test` for available automated tests and `npm run build` before release. Do not point local or staging builds at production Supabase, storage, or billing credentials.
