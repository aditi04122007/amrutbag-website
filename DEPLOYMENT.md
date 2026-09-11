# 🚀 Amrut Bag – Deployment Guide (Vercel & Render)

This guide walks you through deploying the **Amrut Bag** full-stack e-commerce application:
- **Backend (Node.js/Express)** $\rightarrow$ Deployed on **[Render](https://render.com)**
- **Frontend (React + Vite + Tailwind CSS)** $\rightarrow$ Deployed on **[Vercel](https://vercel.com)**

---

## ⚡ Zero-Database-Error Guarantee
The backend includes an automatic **smart fallback storage engine** (`backend/config/fallbackDb.js`):
- **If MySQL is connected**: It automatically uses MySQL as normal.
- **If MySQL is unreachable (ECONNREFUSED) or not configured**: It automatically and seamlessly switches to the built-in persistent storage engine with all **23+ bags, categories, admin, and demo users pre-seeded**.
- **Result**: You can deploy to Render **without needing to set up or pay for an external database**. It starts instantly with **0 database errors**!

---

## 📦 Part 1: Deploy Backend to Render

1. Go to **[Render.com](https://render.com)** and log in or sign up.
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repo:
   ```
   https://github.com/aditi04122007/amrutbag-website
   ```
4. Configure the Web Service settings:
   - **Name**: `amrutbag-backend` (or any name you prefer)
   - **Region**: Choose the closest region (e.g., *Singapore*, *Frankfurt*, or *Oregon*)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(Important!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   |---|---|---|
   | `PORT` | `5000` | Render sets this or defaults to 5000 |
   | `NODE_ENV` | `production` | Recommended |
   | `JWT_SECRET` | `amrutbag_secure_jwt_secret_2026` | Any secret string |
   | *`DB_HOST`* | *(Optional)* | Only if you have a remote MySQL database |

6. Click **Deploy Web Service**.
7. Render will install dependencies and start your backend. Once deployed, note your backend URL:
   ```
   https://amrutbag-backend.onrender.com
   ```
   *(Test it in your browser: `https://<your-backend-url>/` should return `{"status":"healthy", ...}`)*.

---

## 🌐 Part 2: Deploy Frontend to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and log in or sign up.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository:
   ```
   https://github.com/aditi04122007/amrutbag-website
   ```
4. Configure Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**:
     - *Option A (Default)*: Leave as root `./` (Our universal `build-vercel.js` script handles everything automatically!)
     - *Option B*: Or click *Edit* and select `frontend`
   - **Build Command**: Leave as default / automatic
   - **Output Directory**: Leave as default / automatic
   - **Install Command**: Leave as default / automatic

5. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://amrutbag-backend.onrender.com/api` |
   
   > ⚠️ **Important Format Rules for `VITE_API_URL`**:
   > - ✅ **Correct**: `https://amrutbag-backend.onrender.com/api`
   > - ❌ **Do NOT include quotes**: e.g., `"https://..."` or `'https://...'`
   > - ❌ **Do NOT include angle brackets**: e.g., `<https://...>` or `<your-url>`
   > - Ensure it starts with `https://` and ends with `/api`.
   *(Replace with your actual Render backend URL from Part 1, followed by `/api`)*

6. Click **Deploy**.
7. Vercel will build the frontend and provide your live store URL:
   ```
   https://amrutbag-website.vercel.app
   ```

---

## 🔑 Pre-Configured Accounts for Testing

Once deployed, you can immediately log into the live site:

### 1. Admin Portal
- **URL**: `https://<your-vercel-domain>/login`
- **Email**: `admin@amrutbag.com` (or `admin@shopsphere.com`)
- **Password**: `admin123`
- **Access**: Full Admin Portal at `/admin` (Manage 23+ bag products, review customer orders, change order fulfillment status).

### 2. Demo Customer Account
- **Email**: `user@shopsphere.com`
- **Password**: `user123`
- **Or**: Register a new account directly from the website!

---

## 💳 Testing Payments on the Live Site
- Add any **School Bag**, **Traveling Bag**, or **Tiffin Bag** to your cart.
- Proceed to **Checkout**.
- Select **UPI Payment** $\rightarrow$ Enter your UPI ID (e.g. `yourname@oksbi`) or choose **Scan QR Code**.
- Place your order $\rightarrow$ Observe instant order confirmation!
- Log in as Admin to see your order, complete with your name, phone number, address, and UPI payment details.
