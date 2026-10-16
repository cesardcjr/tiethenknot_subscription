const { Pool } = require("pg");

let pool;

function database() {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
      max: Number.parseInt(process.env.DATABASE_POOL_MAX || "10", 10),
    });
  }
  return pool;
}

async function verifyDatabase() {
  await database().query("select 1");
}

module.exports = { database, verifyDatabase };
