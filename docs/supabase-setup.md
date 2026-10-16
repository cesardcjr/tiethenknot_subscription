# Supabase setup

Create separate Supabase projects for staging and production. Never reuse the production connection string in staging.

1. Create a project in the closest suitable region.
2. In the SQL Editor, run the migrations in `supabase/migrations` in filename order, or link the repository with the Supabase CLI and run `supabase db push`.
3. Copy the server connection pooler URL into the API host as `DATABASE_URL`. It is server-only and must never be prefixed with `VITE_`.
4. Configure a separate storage bucket only when the media migration replaces the reference Cloudinary integration. Keep storage policies private by default.
5. Back up before every production migration. Verify a restore in staging before relying on a backup policy.

The initial release accesses Postgres through Express using a server-only database role. RLS is enabled on core tables as a defense-in-depth boundary; add and test explicit RLS policies before introducing direct browser access.
