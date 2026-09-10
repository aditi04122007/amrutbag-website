import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Health check route
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS status");
    res.json({
      message: "Amrut Bag API is running smoothly",
      status: "healthy",
      engine: pool.isFallback && pool.isFallback() ? "Built-in Persistent Storage" : "MySQL",
      database: rows.length > 0 ? "Connected" : "Disconnected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      message: "Amrut Bag API is running (Fallback mode)",
      status: "healthy",
      engine: "Built-in Persistent Storage",
      timestamp: new Date().toISOString()
    });
  }
});

app.get("/api/health", async (req, res) => {
  res.json({
    status: "healthy",
    engine: pool.isFallback && pool.isFallback() ? "Built-in Persistent Storage" : "MySQL",
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal server error:", err);
  res.status(err.status || 500).json({
    message: err.message || "An unexpected server error occurred."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Amrut Bag Server running on http://0.0.0.0:${PORT}`);
});