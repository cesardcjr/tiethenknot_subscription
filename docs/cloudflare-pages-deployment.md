# Cloudflare Pages deployment

Create two Cloudflare Pages projects from this repository: one with root directory `apps/planner` and another with root directory `apps/invitation-studio`.

For both projects, use build command `npm run build` and output directory `dist`. Configure the public API URL as the appropriate `VITE_API_URL`; configure `VITE_PUBLIC_URL` on Invitation Studio to its final public domain and `VITE_INVITATION_APP_URL` on Planner to the Studio domain. These values are embedded at build time, so redeploy after changing them.

Use preview deployments for staging branches and set the production branch only after staging verification. Configure SPA fallback handling before testing direct links such as `/i/<token>`. Keep the prior deployment available for rollback until smoke testing succeeds.
