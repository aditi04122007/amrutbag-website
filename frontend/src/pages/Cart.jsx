import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Footer from "../components/Footer";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck
} from "../components/Icons";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    totalAmount,
    totalItems
  } = useContext(CartContext);

  const shippingCost = totalAmount > 99 || totalAmount === 0 ? 0 : 10;
  const estimatedTax = totalAmount * 0.05;
  const grandTotal = totalAmount + shippingCost + estimatedTax;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              You have {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our handcrafted bag collections.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemSubtotal = (item.price * item.quantity).toFixed(2);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-bold text-gray-900 text-base sm:text-lg block hover:text-indigo-600 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm font-semibold text-gray-500">
                        ${parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="p-1.5 rounded-lg bg-white shadow-xs text-gray-600 hover:text-gray-900"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="p-1.5 rounded-lg bg-white shadow-xs text-gray-600 hover:text-gray-900"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                      <span className="text-base sm:text-lg font-black text-gray-900">
                        ${itemSubtotal}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex justify-between items-center">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-black text-gray-900 tracking-tight pb-4 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="font-bold text-emerald-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>

                  {shippingCost > 0 && (
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-xs text-indigo-700 font-medium">
                      Add ${(99 - totalAmount).toFixed(2)} more for <strong>Free Delivery</strong>!
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-base font-black text-gray-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="pt-2 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Safe & Secure 256-Bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Tracked doorstep shipping with real-time updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}