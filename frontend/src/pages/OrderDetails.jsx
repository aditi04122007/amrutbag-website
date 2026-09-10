import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import Footer from "../components/Footer";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "../components/Icons";

const ORDER_STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order", err);
        setError("Order not found or you are not authorized to view it.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "Unable to find the specified order."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/orders" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-2 inline-block">
              ← Back to All Orders
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Order #{order.id}
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                isCancelled ? "bg-rose-50 text-rose-700" : "bg-indigo-50 text-indigo-700"
              }`}>
                {order.status}
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 mb-8">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
            Live Order Progress
          </h2>

          {isCancelled ? (
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span>This order has been cancelled.</span>
            </div>
          ) : (
            <div className="relative flex flex-col sm:flex-row justify-between gap-6 sm:gap-2">
              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex-1 flex sm:flex-col items-center gap-3 relative">
                    {/* Circle Indicator */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${
                        isCompleted
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>

                    {/* Step label */}
                    <div className="sm:text-center">
                      <p className={`text-sm font-bold ${isCurrent ? "text-indigo-600" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {step}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {step === "Pending" && "Order received"}
                        {step === "Confirmed" && "Items packaged"}
                        {step === "Shipped" && "In courier transit"}
                        {step === "Delivered" && "Signed & delivered"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Two Columns: Delivery Info & Itemized Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Ordered Products ({order.items?.length || 0})
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product_id}`}
                        className="font-bold text-sm text-gray-900 hover:text-indigo-600 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
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

            <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="text-xl font-black text-indigo-600">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Recipient Details */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Shipping & Recipient Details
            </h2>

            {order.shipping_details ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">Recipient</span>
                  <span className="font-bold text-gray-900">{order.shipping_details.fullName || order.customer_name}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">Contact Phone</span>
                  <span className="text-gray-700">{order.shipping_details.phone || "Not specified"}</span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase">Delivery Address</span>
                  <p className="text-gray-700 leading-relaxed">
                    {order.shipping_details.address || order.shipping_address}<br />
                    {order.shipping_details.city && `${order.shipping_details.city}, `}
                    {order.shipping_details.state && `${order.shipping_details.state} `}
                    {order.shipping_details.postalCode}
                  </p>
                </div>

                {order.shipping_details.paymentMethod && (
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Payment Mode</span>
                    <span className="font-semibold text-gray-900 text-xs inline-flex items-center gap-1.5 mt-0.5">
                      {order.shipping_details.paymentMethod === "upi" ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                          ⚡ UPI Payment ({order.shipping_details.upiId || order.shipping_details.upiApp || "Instant UPI"})
                        </span>
                      ) : order.shipping_details.paymentMethod === "card" ? (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md">
                          💳 Credit / Debit Card (Online)
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                          📦 Cash on Delivery (COD)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-700">{order.shipping_address}</p>
            )}

            <div className="pt-4 border-t border-gray-100">
              <div className="p-3.5 bg-indigo-50/60 rounded-2xl flex items-center gap-3 text-xs text-indigo-800">
                <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Our courier dispatch team will reach out via phone before delivery.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
