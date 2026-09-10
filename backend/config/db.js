import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend folder specifically or cwd
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "mysql",
  database: process.env.DB_NAME || "bagstore",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;