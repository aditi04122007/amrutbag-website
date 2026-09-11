import axios from "axios";

/**
 * Resolves and sanitizes the API base URL.
 * Handles:
 * - Accidental quotes, angle brackets (<...>), spaces, or 'undefined'/'null'
 * - Missing http/https protocol
 * - Missing /api suffix
 * - Browser URL constructor safety
 */
const resolveBaseUrl = () => {
  try {
    const raw = import.meta.env.VITE_API_URL;
    let url = typeof raw === "string" ? raw.trim() : "";

    // Strip surrounding quotes and angle brackets
    url = url.replace(/^["'“”‘’<]+|["'“”‘’>]+$/g, "").trim();

    // Auto-correct old documentation URL to active live Render service
    if (url.includes("amrutbag-backend.onrender.com")) {
      url = url.replace("amrutbag-backend.onrender.com", "amrutbag-website.onrender.com");
    }

    // Check if empty, invalid placeholder, or literal "undefined" / "null"
    if (
      !url ||
      url === "undefined" ||
      url === "null" ||
      url.includes("<") ||
      url.includes(">")
    ) {
      if (
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        // Fallback to active live Render backend
        return "https://amrutbag-website.onrender.com/api";
      }
      return "http://localhost:5000/api";
    }

    // Prepend protocol if omitted
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
      url = url.startsWith("localhost") ? `http://${url}` : `https://${url}`;
    }

    // Strip trailing slashes
    url = url.replace(/\/+$/, "");

    // Ensure /api suffix exists
    if (!url.endsWith("/api") && !url.includes("/api/")) {
      url = `${url}/api`;
    }

    // Validate using URL constructor safely inside try/catch
    if (!url.startsWith("/")) {
      new URL(url);
    }

    return url;
  } catch (err) {
    console.warn("[AmrutBag] Invalid VITE_API_URL detected, using fallback:", err);
    return typeof window !== "undefined" && window.location.hostname !== "localhost"
      ? "https://amrutbag-website.onrender.com/api"
      : "http://localhost:5000/api";
  }
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatic background wake-up ping for free hosting (Render) cold starts
if (typeof window !== "undefined") {
  api.get("/health").catch(() => {});
}

// Interceptor to attach Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global auth errors (e.g. expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if already on login or register
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        // Optional clear on 401 if expired
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;