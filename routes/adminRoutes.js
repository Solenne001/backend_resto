import express from "express";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Exemple route dashboard
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ success: true, message: "Bienvenue sur le dashboard admin !" });
});

export default router;
