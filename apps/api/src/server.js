const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: fs.existsSync(path.join(__dirname, "../.env.local"))
    ? path.join(__dirname, "../.env.local")
    : path.join(__dirname, "../.env"),
});
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const { verifyDatabase } = require("./config/db");

const app = express();

// Render forwards requests through its proxy layer. Trust exactly the nearest
// proxy by default so rate limits use the forwarded client IP, not Render's IP.
const configuredProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS || "1", 10);
app.set("trust proxy", Number.isInteger(configuredProxyHops) && configuredProxyHops > 0 ? configuredProxyHops : 1);

for (const key of ["DATABASE_URL", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const parseCommaSeparated = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseCommaSeparated(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL),
  "https://tietheknot-mern-front-end.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
].filter((origin, index, origins) => origins.indexOf(origin) === index);

// Use '*' only for a hostname segment, for example:
// https://tietheknot-mern-front-*.vercel.app
// Keep this unset in production unless preview deployments are intentionally trusted.
const allowedOriginPatterns = parseCommaSeparated(process.env.ALLOWED_ORIGIN_PATTERNS)
  .map((pattern) => new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, "[^/]+")}$`));

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin) || allowedOriginPatterns.some((pattern) => pattern.test(origin));

const corsOptions = {
    origin: function (origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.get("/", (req, res) => res.json({ message: "TieTheKnot API is running", database: "Supabase Postgres" }));
app.get("/health", async (req, res) => {
  try {
    await verifyDatabase();
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many authentication attempts. Please try again later." },
  }),
  require("./routes/authPostgres"),
);
app.use("/api/data", require("./routes/dataPostgres"));
app.use("/api/users", require("./routes/usersPostgres"));
app.use("/api/invitations", require("./routes/invitationsPostgres"));
app.use("/api/public/invitations", require("./routes/publicInvitationsPostgres"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
const start = async () => {
  await verifyDatabase();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
