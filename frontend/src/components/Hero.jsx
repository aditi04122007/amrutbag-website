import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Clock, ShoppingBag } from "./Icons";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-indigo-50/60 via-white to-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 -z-10 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
              School • Traveling • Tiffin Bags Destination
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight sm:leading-none">
              Your Premier Destination For <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Every Kind of Bag
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore our heavy-duty <strong>School Bags</strong> for students, durable <strong>Traveling Bags</strong> for your next journey, and insulated <strong>Tiffin Bags</strong> that keep meals fresh all day.
            </p>

            {/* Quick Category Jump Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <Link
                to="/products?category=School+Bags"
                className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 transition"
              >
                🎒 School Bags
              </Link>
              <Link
                to="/products?category=Traveling+Bags"
                className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition"
              >
                🧳 Traveling Bags
              </Link>
              <Link
                to="/products?category=Tiffin+Bags"
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition"
              >
                🍱 Tiffin Bags
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5"
              >
                Shop All Bags
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#categories"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-base transition-colors"
              >
                Explore Categories
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-gray-900">1,000+</p>
                <p className="text-xs text-gray-500 font-medium">Bags Delivered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.9★</p>
                <p className="text-xs text-gray-500 font-medium">Over 2,500 Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500 font-medium">Quality Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
                  alt="Amrut Bag Showcase"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Highlight Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5 max-w-[240px]">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  ★ 4.9
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Top Rated Bags</p>
                  <p className="text-[11px] text-gray-500">School, Travel & Tiffin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges Banner */}
        <div className="mt-16 pt-10 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Free Express Delivery</p>
              <p className="text-xs text-gray-500">On all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Secure Payments</p>
              <p className="text-xs text-gray-500">256-bit encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">30-Day Easy Returns</p>
              <p className="text-xs text-gray-500">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">24/7 Support</p>
              <p className="text-xs text-gray-500">Dedicated shopping help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}