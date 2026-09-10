import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { CheckCircle, Package, ArrowRight, Truck } from "../components/Icons";

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const stateData = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-4 mb-2">
            Thank You For Your Purchase!
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Your order has been received and is now being prepared with exceptional care.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left border border-gray-100 space-y-3 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono font-bold text-gray-900 text-base">#{id}</span>
            </div>

            {stateData.totalAmount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Charged:</span>
                <span className="font-bold text-indigo-600 text-base">
                  ${parseFloat(stateData.totalAmount).toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Estimated Delivery:</span>
              <span className="font-semibold text-gray-800">3 - 5 Business Days</span>
            </div>

            {stateData.shipping?.address && (
              <div className="flex justify-between items-start pt-2 border-t border-gray-200 text-xs">
                <span className="text-gray-500">Delivery To:</span>
                <span className="font-medium text-gray-800 text-right max-w-xs">
                  {stateData.shipping.fullName}, {stateData.shipping.address}, {stateData.shipping.city}, {stateData.shipping.state} {stateData.shipping.postalCode}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/orders/${id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition"
            >
              <Package className="w-4 h-4" /> Track This Order
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-sm transition"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
