import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fallbackDb from "./fallbackDb.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend folder specifically or cwd
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

let isFallbackMode = false;
let mysqlPool = null;

// Initialize MySQL pool if DB_HOST is provided
try {
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "mysql",
    database: process.env.DB_NAME || "bagstore",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 4000
  });
} catch (err) {
  console.warn("⚠️ MySQL pool creation skipped, using built-in storage engine.");
  isFallbackMode = true;
}

// Automatic connection verification
async function testConnection() {
  if (!mysqlPool) {
    isFallbackMode = true;
    return;
  }
  try {
    const conn = await mysqlPool.getConnection();
    await conn.query("SELECT 1 AS test");
    conn.release();
    isFallbackMode = false;
    console.log("✅ MySQL Database connected successfully.");
  } catch (err) {
    isFallbackMode = true;
    console.log(`ℹ️ MySQL connection status: ${err.code || err.message}`);
    console.log("⚡ Seamlessly activated built-in persistent storage engine. Zero setup required!");
  }
}

// Run initial connection test in background
testConnection();

// Smart pool proxy supporting MySQL and transparent fallback
const pool = {
  async query(sql, params = []) {
    if (isFallbackMode || !mysqlPool) {
      return fallbackDb.query(sql, params);
    }
    try {
      return await mysqlPool.query(sql, params);
    } catch (err) {
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "PROTOCOL_CONNECTION_LOST" ||
        err.code === "ETIMEDOUT" ||
        err.code === "ENOTFOUND" ||
        err.code === "ER_ACCESS_DENIED_ERROR" ||
        err.code === "ER_BAD_DB_ERROR" ||
        err.code === "HANDSHAKE_ERROR"
      ) {
        if (!isFallbackMode) {
          isFallbackMode = true;
          console.warn(`⚠️ MySQL disconnected (${err.code}). Seamlessly routing to built-in fallback storage.`);
        }
        return fallbackDb.query(sql, params);
      }
      throw err;
    }
  },

  async getConnection() {
    if (isFallbackMode || !mysqlPool) {
      return fallbackDb.getConnection();
    }
    try {
      return await mysqlPool.getConnection();
    } catch (err) {
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "PROTOCOL_CONNECTION_LOST" ||
        err.code === "ETIMEDOUT" ||
        err.code === "ENOTFOUND" ||
        err.code === "ER_ACCESS_DENIED_ERROR" ||
        err.code === "ER_BAD_DB_ERROR" ||
        err.code === "HANDSHAKE_ERROR"
      ) {
        if (!isFallbackMode) {
          isFallbackMode = true;
          console.warn(`⚠️ MySQL connection unavailable (${err.code}). Using built-in transaction engine.`);
        }
        return fallbackDb.getConnection();
      }
      throw err;
    }
  },

  isFallback() {
    return isFallbackMode;
  }
};

export default pool;