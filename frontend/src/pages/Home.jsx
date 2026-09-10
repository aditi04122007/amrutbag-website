import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import PromoBanner from "../components/PromoBanner";
import BestSellers from "../components/BestSellers";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <PromoBanner />
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}