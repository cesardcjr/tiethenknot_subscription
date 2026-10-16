const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const migration = fs.readFileSync(path.resolve(__dirname, "../../../supabase/migrations/202610160001_initial_schema.sql"), "utf8");

test("Supabase migration contains the application ownership and subscription boundaries", () => {
  for (const table of ["profiles", "workspaces", "workspace_members", "events", "guests", "invitations", "subscriptions", "billing_webhook_events"]) {
    assert.match(migration, new RegExp(`create table public\\.${table}`));
  }
  assert.match(migration, /unique\(event_id, guest_id\)/);
  assert.match(migration, /primary key\(provider, provider_event_id\)/);
});

test("the API server requires a Postgres connection rather than MongoDB", () => {
  const server = fs.readFileSync(path.resolve(__dirname, "../src/server.js"), "utf8");
  assert.match(server, /DATABASE_URL/);
  assert.doesNotMatch(server, /MONGO_URI/);
});
