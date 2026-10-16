# API deployment

Deploy `apps/api` to a persistent Node.js host such as Render. Required server-only settings include `DATABASE_URL`, `JWT_SECRET`, `INVITATION_TOKEN_SECRET`, `ALLOWED_ORIGINS`, and `TRUST_PROXY_HOPS=1` when the host forwards one proxy hop.

Configure exact Planner and Invitation Studio origins. Do not use a broad production CORS wildcard. Verify `/health`, authenticated planner requests, invitation link retrieval, and public RSVP submission from the deployed front-end origins before release.

Use a dedicated staging API and database. Roll back by redeploying the previous API version only after checking migration compatibility; database migrations must be additive or have an independently tested restoration path.
