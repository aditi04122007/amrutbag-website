import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Search, Filter, X } from "../components/Icons";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL query or default
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const selectedSort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(searchQuery);

  // Fetch distinct categories
  useEffect(() => {
    async function fetchCats() {
      try {
        const data = await getCategories();
        setCategories(["All", ...data]);
      } catch {
        setCategories(["All", "Handbags", "Backpacks", "Travel Bags", "Laptop Bags", "Wallets & Clutches"]);
      }
    }
    fetchCats();
  }, []);

  // Sync search input if URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch filtered products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (selectedCategory && selectedCategory !== "All") params.category = selectedCategory;
        if (selectedSort) params.sort = selectedSort;

        const data = await getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [searchQuery, selectedCategory, selectedSort]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter("search", searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = searchQuery || (selectedCategory && selectedCategory !== "All") || (selectedSort && selectedSort !== "newest");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Header & Breadcrumbs */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Explore All Bags & Accessories
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Showing {products.length} {products.length === 1 ? "product" : "products"}
            {selectedCategory !== "All" && ` in "${selectedCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-100 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
              <input
                type="text"
                placeholder="Search by bag name, material..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateFilter("search", "");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full py-2.5 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full py-2.5 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 mr-1">Quick Select:</span>
            {categories.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => updateFilter("category", c)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {c}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1 hover:underline"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-96 p-4 border border-gray-100 shadow-xs animate-pulse">
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products matched your criteria</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search keyword or switching category filter.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}