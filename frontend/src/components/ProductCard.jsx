import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Star, ShoppingCart, Eye } from "./Icons";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const priceFormatted = parseFloat(product.price).toFixed(2);
  const rating = parseFloat(product.rating || 4.5);

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full bg-gray-100 overflow-hidden">
        <img
          src={product.image || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 tracking-wide shadow-xs">
          {product.category}
        </span>

        {/* Stock Badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            Sold out
          </span>
        )}

        {/* Quick View overlay link */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        ></Link>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                filled={i < Math.floor(rating)}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-600 ml-1">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-gray-900 text-base line-clamp-1 hover:text-indigo-600 transition-colors mb-1"
        >
          {product.name}
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-black text-gray-900 tracking-tight">
              ${priceFormatted}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.id}`}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-xs hover:shadow-md transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
