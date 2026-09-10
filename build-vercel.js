import fs from "fs";
import { execSync } from "child_process";
import path from "path";

console.log("🚀 Starting Amrut Bag build process for Vercel...");

// Check if running from root or from inside frontend/
const isInsideFrontend = fs.existsSync("./src") && fs.existsSync("./vite.config.js");
const targetDir = isInsideFrontend ? "." : "./frontend";

console.log(`📂 Working directory: ${process.cwd()} (Target: ${targetDir})`);

// 1. Install dependencies
console.log("📦 Installing dependencies...");
execSync("npm install --include=dev", {
  cwd: targetDir,
  stdio: "inherit"
});

// 2. Build Vite bundle
console.log("⚡ Compiling Vite bundle...");
execSync("npm run build", {
  cwd: targetDir,
  stdio: "inherit"
});

// 3. Mirror output directory to ./dist if built from root
if (!isInsideFrontend) {
  const frontendDist = path.resolve("./frontend/dist");
  const rootDist = path.resolve("./dist");
  if (fs.existsSync(frontendDist)) {
    if (!fs.existsSync(rootDist)) {
      fs.mkdirSync(rootDist, { recursive: true });
    }
    fs.cpSync(frontendDist, rootDist, { recursive: true });
    console.log("📁 Synced output bundle to both ./frontend/dist and ./dist");
  }
}

console.log("✅ Build completed successfully!");
