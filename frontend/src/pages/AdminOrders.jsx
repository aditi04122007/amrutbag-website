import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, updateOrder, deleteOrder } from "../api/orderApi";
import Footer from "../components/Footer";
import {
  ShoppingCart,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Truck,
  Package
} from "../components/Icons";

const ORDER_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_CLASSES = {
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  Shipped: "bg-purple-50 text-purple-800 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchOrdersData = async () => {
    try {
      const data = await getOrders({ status: statusFilter });
      setOrders(data);
    } catch (err) {
      console.error("Failed to load admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      await updateOrder(orderId, { status: newStatus });
      setFeedback({
        type: "success",
        message: `Order #${orderId} status successfully updated to "${newStatus}".`
      });
      // Update locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to update status."
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return;

    try {
      await deleteOrder(orderId);
      setFeedback({ type: "success", message: `Order #${orderId} removed.` });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || err.message || "Failed to delete order."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link to="/admin" className="text-purple-600 font-bold hover:underline">
                Dashboard
              </Link>
              <span>/</span>
              <span>Customer Orders</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Order Fulfillment & Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Review customer deliveries, verify line items, and adjust live statuses
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between text-sm ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === "All"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Orders
          </button>
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === status
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List / Cards */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-48 border border-gray-100 shadow-xs animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-12 text-center max-w-md mx-auto my-12">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-xs text-gray-500">
              {statusFilter !== "All"
                ? `There are no orders with status "${statusFilter}".`
                : "No customer orders have been placed yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusClass = STATUS_CLASSES[order.status] || "bg-gray-100 text-gray-800";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 bg-gray-50/70 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div>
                        <span className="text-[11px] text-gray-400 font-bold uppercase block">Order ID</span>
                        <span className="font-mono font-black text-gray-900 text-base">#{order.id}</span>
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-400 font-bold uppercase block">Placed On</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-400 font-bold uppercase block">Total</span>
                        <span className="font-black text-indigo-600 text-base">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-gray-500">Status:</label>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-hidden cursor-pointer transition ${statusClass}`}
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Body: Customer details + Ordered Items */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Customer Info */}
                    <div className="lg:col-span-4 bg-gray-50/60 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
                      <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px] mb-2">
                        Customer & Shipping Details
                      </span>
                      <p className="text-gray-900 font-bold text-sm">
                        {order.shipping_details?.fullName || order.customer_name}
                      </p>
                      <p className="text-gray-500">{order.customer_email}</p>
                      {order.shipping_details?.phone && (
                        <p className="text-gray-600">📞 {order.shipping_details.phone}</p>
                      )}
                      <p className="text-gray-700 pt-1 leading-relaxed">
                        📍 {order.shipping_details?.address || order.shipping_address}<br />
                        {order.shipping_details?.city && `${order.shipping_details.city}, `}
                        {order.shipping_details?.state && `${order.shipping_details.state} `}
                        {order.shipping_details?.postalCode}
                      </p>

                      {/* Payment Method Badge */}
                      <div className="pt-2 border-t border-gray-200/60">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                          Payment Mode:
                        </span>
                        {order.shipping_details?.paymentMethod === "upi" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                            ⚡ UPI: {order.shipping_details.upiId || order.shipping_details.upiApp || "Instant"}
                          </span>
                        ) : order.shipping_details?.paymentMethod === "card" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-200">
                            💳 Credit / Debit Card
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold text-[11px] border border-amber-200">
                            📦 Cash on Delivery (COD)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="lg:col-span-8">
                      <span className="font-bold text-gray-900 uppercase tracking-wider block text-[11px] mb-3">
                        Ordered Items ({order.items?.length || 0})
                      </span>
                      <div className="divide-y divide-gray-100">
                        {order.items?.map((item) => (
                          <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
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