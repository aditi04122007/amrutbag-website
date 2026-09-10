import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/productApi";
import { ArrowRight } from "./Icons";

const CATEGORY_IMAGES = {
  "School Bags": "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=600&auto=format&fit=crop&q=80",
  "Traveling Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  "Tiffin Bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80",
  "Handbags": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
  "Backpacks": "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop&q=80",
  "Laptop Bags": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
  "Travel Bags": "https://images.unsplash.com/photo-1510519138111-5778749725f0?w=600&auto=format&fit=crop&q=80",
  "Wallets & Clutches": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80",
};

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        // Ensure School Bags, Traveling Bags, and Tiffin Bags appear upfront
        const priority = ["School Bags", "Traveling Bags", "Tiffin Bags"];
        const sorted = [
          ...priority.filter((c) => data.includes(c)),
          ...data.filter((c) => !priority.includes(c)),
        ];
        setCategories(sorted);
      } catch {
        setCategories(["School Bags", "Traveling Bags", "Tiffin Bags", "Handbags", "Backpacks", "Laptop Bags"]);
      }
    }
    load();
  }, []);

  return (
    <section id="categories" className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Top Bag Collections
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              School, Travel, Tiffin & Lifestyle Bags
            </p>
          </div>
          <Link
            to="/products"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            All Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.slice(0, 6).map((category) => {
            const image =
              CATEGORY_IMAGES[category] ||
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80";

            return (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                  <img
                    src={image}
                    alt={category}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 text-center">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-xs sm:text-sm truncate">
                    {category}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Explore Line →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}