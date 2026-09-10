import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import Footer from "../components/Footer";
import { Package, ArrowRight, Clock, CheckCircle } from "../components/Icons";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-purple-50 text-purple-700 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and review your previous purchases
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-40 p-6 border border-gray-100 shadow-xs animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders placed yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              When you order products from Amrut Bag, your order records and tracking details will appear here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusClass =
                STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700 border-gray-200";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">Order Placed</span>
                        <span className="font-bold text-gray-900">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">Total Amount</span>
                        <span className="font-black text-gray-900">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-gray-400 block font-semibold uppercase">Order ID</span>
                        <span className="font-mono font-bold text-gray-900">
                          #{order.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
                        {order.status}
                      </span>
                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Order Products Snippet */}
                  <div className="p-5 sm:p-6">
                    <div className="divide-y divide-gray-100">
                      {order.items?.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/product/${item.product_id}`}
                                className="font-bold text-sm text-gray-900 hover:text-indigo-600 transition line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <span className="font-bold text-sm text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}