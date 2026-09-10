import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats } from "../api/orderApi";
import Footer from "../components/Footer";
import {
  User,
  Package,
  ShoppingCart,
  ShieldCheck,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Smartphone,
  CreditCard,
  Truck
} from "../components/Icons";

const STATUS_BADGES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Amrut Bag Admin Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Store Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time sales, order fulfillment, and product catalog overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Manage Products
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition"
            >
              <ShoppingCart className="w-4 h-4" /> Manage Orders
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-32 p-6 border border-gray-100 shadow-xs animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Revenue */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                    ${(stats?.totalRevenue || 0).toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Verified gross volume</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  $
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">Orders placed</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              {/* Total Products */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                    {stats?.totalProducts || 0}
                  </p>
                  <p className="text-xs font-semibold text-purple-600 mt-1">Active inventory items</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                    {stats?.totalUsers || 0}
                  </p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">Registered accounts</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Order Status Breakdown Bar */}
            {stats?.statusDistribution && stats.statusDistribution.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 mb-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Order Status Overview
                </h3>
                <div className="flex flex-wrap gap-3">
                  {stats.statusDistribution.map((item) => (
                    <div
                      key={item.status}
                      className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                        STATUS_BADGES[item.status] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      <span>{item.status}:</span>
                      <span className="text-sm font-black">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of Recent Orders and Recent Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders - Full Customer Identity */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-7">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Customer Orders</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Full customer contact info, delivery address, and payment mode
                    </p>
                  </div>
                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition"
                  >
                    View All Orders <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {stats?.recentOrders?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentOrders.map((order) => {
                      const shipping = order.shipping_details || {};
                      const customerName = shipping.fullName || order.customer_name;
                      const customerEmail = shipping.email || order.customer_email;
                      const customerPhone = shipping.phone;
                      const fullAddress = shipping.address || order.shipping_address;
                      const paymentMethod = shipping.paymentMethod;
                      const upiId = shipping.upiId;
                      const upiApp = shipping.upiApp;

                      return (
                        <div
                          key={order.id}
                          className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-purple-200 transition space-y-3"
                        >
                          {/* Order Header Row */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-black text-sm text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                                #{order.id}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className="font-black text-base text-gray-900">
                                ${parseFloat(order.total_amount).toFixed(2)}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                STATUS_BADGES[order.status] || "bg-gray-100 text-gray-700"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          {/* Customer Details Block - Who Placed The Order */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            {/* Left: Customer Contact */}
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                Placed By:
                              </span>
                              <p className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                                <User className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>{customerName}</span>
                              </p>
                              <p className="text-gray-600 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span>{customerEmail}</span>
                              </p>
                              {customerPhone ? (
                                <p className="text-gray-700 font-medium flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{customerPhone}</span>
                                </p>
                              ) : (
                                <p className="text-gray-400 italic">No phone provided</p>
                              )}
                            </div>

                            {/* Right: Shipping Address & Payment Mode */}
                            <div className="space-y-1.5 sm:border-l sm:border-gray-200 sm:pl-3">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                Delivery Address & Payment:
                              </span>
                              <p className="text-gray-700 leading-relaxed flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                <span>
                                  {fullAddress}
                                  {shipping.city && `, ${shipping.city}`}
                                  {shipping.state && `, ${shipping.state}`}
                                  {shipping.postalCode && ` ${shipping.postalCode}`}
                                </span>
                              </p>

                              {/* Payment badge */}
                              <div className="pt-1 flex items-center gap-1.5">
                                {paymentMethod === "upi" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>UPI: {upiId || upiApp || "Instant"}</span>
                                  </span>
                                ) : paymentMethod === "card" ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                                    <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Credit / Debit Card</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Cash on Delivery</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-10 text-center">No customer orders recorded yet.</p>
                )}
              </div>

              {/* Recent Products */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h2 className="text-base font-bold text-gray-900">Catalog Preview</h2>
                  <Link to="/admin/products" className="text-xs font-bold text-purple-600 hover:text-purple-700">
                    Manage Products →
                  </Link>
                </div>

                {stats?.recentProducts?.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {stats.recentProducts.map((prod) => (
                      <div key={prod.id} className="py-3 flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                          <p className="text-[11px] text-gray-500">{prod.category} • Stock: {prod.stock}</p>
                        </div>
                        <span className="text-xs font-black text-gray-900">
                          ${parseFloat(prod.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-6 text-center">No products found.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}