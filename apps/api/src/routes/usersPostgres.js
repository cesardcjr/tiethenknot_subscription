const router = require("express").Router();
const { database } = require("../config/db"); const { protect, adminOnly } = require("../middleware/authPostgres");
router.use(protect, adminOnly);
const safe = (r) => ({ _id:r.id, username:r.username, fullName:r.full_name, isAdmin:r.is_admin, isActive:r.status === "active", createdDate:r.created_at });
router.get("/", async (_req,res) => { const {rows}=await database().query("select id,username,full_name,is_admin,status,created_at from profiles order by created_at desc"); res.json({users:rows.map(safe)}); });
router.patch("/:id/status", async (req,res) => { if (typeof req.body.isActive !== "boolean") return res.status(400).json({message:"Account status must be active or inactive"}); const {rows}=await database().query("update profiles set status=$1 where id=$2 and is_admin=false returning id,username,full_name,contact_number,is_admin,status,created_at", [req.body.isActive ? "active" : "suspended", req.params.id]); if(!rows[0]) return res.status(404).json({message:"User not found"}); res.json({user:safe(rows[0])}); });
module.exports=router;
