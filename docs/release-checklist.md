# Release checklist

- [ ] Staging and production use separate Supabase projects, API secrets, storage, and webhook endpoints.
- [ ] Database migration was applied to staging and restore behavior was verified.
- [ ] Planner, Invitation Studio, public RSVP, admin approval, and mobile flows passed smoke tests.
- [ ] API `/health` is healthy from the intended environment.
- [ ] CORS permits only the intended deployed origins.
- [ ] Tests and production builds passed with recorded output.
- [ ] Subscription webhooks are signature-verified and idempotent before billing is enabled.
- [ ] A rollback owner, rollback deployment, and database recovery decision are documented.
