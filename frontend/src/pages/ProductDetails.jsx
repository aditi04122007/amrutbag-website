import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock
} from "../components/Icons";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      setQuantity(1);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Product not found or has been removed.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">{error || "The requested item is not available."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
        >
          Return to Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const rating = parseFloat(product.rating || 4.5);
  const price = parseFloat(product.price).toFixed(2);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left: Product Image */}
            <div className="lg:col-span-6">
              <div className="aspect-4/5 w-full rounded-2xl overflow-hidden bg-gray-100 shadow-md ring-1 ring-gray-900/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Right: Product Info & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {product.category}
                  </span>
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4" filled={i < Math.floor(rating)} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500 font-medium">Verified Customer Ratings</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-y border-gray-100">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Price</span>
                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                  ${price}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Product Overview
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Select Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="p-2 rounded-lg bg-white shadow-xs text-gray-600 hover:text-gray-900 disabled:opacity-40"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-sm text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="p-2 rounded-lg bg-white shadow-xs text-gray-600 hover:text-gray-900 disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total: <span className="font-bold text-gray-800">${(parseFloat(product.price) * quantity).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold text-base shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 inline-flex items-center justify-center py-4 px-6 rounded-xl border-2 border-gray-900 hover:bg-gray-900 hover:text-white disabled:border-gray-300 disabled:text-gray-400 font-bold text-base transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Free shipping on orders &gt; $99</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>100% Authentic Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Estimated delivery: 2-4 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Recommendations
                </h2>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Related Products in {product.category}
                </p>
              </div>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                View Category <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}