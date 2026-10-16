const jwt = require("jsonwebtoken");
const { database } = require("../config/db");

async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized, no token" });
  try {
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const { rows } = await database().query("select id, username, full_name, contact_number, is_admin, status, created_at from profiles where id = $1", [id]);
    if (!rows[0]) return res.status(401).json({ message: "User not found" });
    if (rows[0].status !== "active") return res.status(403).json({ message: "User account is not active" });
    req.user = { _id: rows[0].id, username: rows[0].username, fullName: rows[0].full_name, contactNumber: rows[0].contact_number, isAdmin: rows[0].is_admin, isActive: true, createdDate: rows[0].created_at };
    next();
  } catch { return res.status(401).json({ message: "Not authorized, token failed" }); }
}
function adminOnly(req, res, next) { return req.user?.isAdmin ? next() : res.status(403).json({ message: "Administrator access is required" }); }
module.exports = { protect, adminOnly };
