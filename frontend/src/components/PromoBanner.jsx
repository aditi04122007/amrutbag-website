import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "./Icons";

export default function PromoBanner() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-gray-900 via-indigo-950 to-purple-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-4 border border-white/10">
              Limited Time Special Offer
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Enjoy 20% Off Your First Bag Order
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
              Use promo code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">AMRUT20</span> at checkout. Premium durable school bags, traveling bags, and tiffin bags.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition shadow-md"
              >
                Shop the Sale <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
