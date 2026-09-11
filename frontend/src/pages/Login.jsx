import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import { ShoppingBag, AlertCircle, ArrowRight } from "../components/Icons";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      if (err.message === "Network Error" || !err.response) {
        setError(
          "Network Error: Unable to connect to the backend. If using Render free hosting, it may be waking up (takes ~30 seconds on cold start). Please wait a moment and try again."
        );
      } else {
        setError(
          err.response?.data?.message || err.message || "Invalid credentials. Please verify."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10 max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 group mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900">
                Amrut<span className="text-indigo-600"> Bag</span>
              </span>
            </Link>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Sign in to manage orders, cart, and profile
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-md shadow-indigo-200 transition"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>

          {/* Quick Demo Login Fill Buttons */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-bold text-gray-400 text-center uppercase tracking-wider">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@amrutbag.com", "admin123")}
                className="px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition text-center"
              >
                Admin Demo Fill
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("user@shopsphere.com", "user123")}
                className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold transition text-center"
              >
                Customer Demo Fill
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-gray-500">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create one here
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}