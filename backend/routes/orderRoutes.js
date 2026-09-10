import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAdminStats
} from "../controllers/orderController.js";
import { verifyToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// User authenticated routes
router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrderById);

// Admin-only routes
router.get("/", verifyToken, requireAdmin, getAllOrders);
router.put("/:id/status", verifyToken, requireAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, requireAdmin, deleteOrder);

// Admin stats endpoint accessible under /api/orders/admin/stats as well
router.get("/admin/stats", verifyToken, requireAdmin, getAdminStats);

export default router;