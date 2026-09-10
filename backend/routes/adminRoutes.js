import express from "express";
import { getAdminStats } from "../controllers/orderController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", verifyToken, requireAdmin, getAdminStats);

export default router;
