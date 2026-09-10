import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "./Icons";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 text-sm border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Amrut<span className="text-indigo-500"> Bag</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Your premier destination for high quality school bags, heavy-duty traveling bags, insulated tiffin bags, and everyday lifestyle backpacks.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-gray-500">
              <span>© {new Date().getFullYear()} Amrut Bag Inc.</span>
              <span>•</span>
              <span>All rights reserved.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link to="/products?category=Handbags" className="hover:text-white transition">Handbags</Link>
              </li>
              <li>
                <Link to="/products?category=Backpacks" className="hover:text-white transition">Backpacks</Link>
              </li>
              <li>
                <Link to="/products?category=Travel+Bags" className="hover:text-white transition">Travel Duffels</Link>
              </li>
              <li>
                <Link to="/products?category=Laptop+Bags" className="hover:text-white transition">Laptop Sleeves</Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-white transition">Track Order</Link>
              </li>
              <li>
                <a href="#return-policy" className="hover:text-white transition">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#shipping-rates" className="hover:text-white transition">Shipping Policy</a>
              </li>
              <li>
                <a href="#warranty" className="hover:text-white transition">2-Year Warranty</a>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Stay Updated</h4>
            <p className="text-xs text-gray-400">Subscribe for early product drops and private member sales.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to Amrut Bag!"); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}