"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = () => {
    setCartCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header
        className={`fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "py-sm shadow-md" : "py-md shadow-sm"
        }`}
      >
        <nav className="max-w-container-max mx-auto px-lg md:px-xl flex justify-between items-center">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              explore
            </span>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight">BookCompass</span>
          </div>

          <div className="hidden lg:flex items-center gap-lg">
            <a className="font-body-md text-primary border-b-2 border-primary pb-1" href="#">Browse</a>
            <a className="font-body-md text-secondary hover:text-primary transition-colors" href="#">New Arrivals</a>
            <a className="font-body-md text-secondary hover:text-primary transition-colors" href="#">Best Sellers</a>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-lg relative group">
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-xl py-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body-sm"
              placeholder="Search titles, authors..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>

          <div className="flex items-center gap-md">
            <button className="relative p-sm hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
              <span
                className={`absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface transition-transform duration-300 ${
                  cartCount > 0 ? "scale-100" : "scale-0"
                }`}
              >
                {cartCount}
              </span>
            </button>
            <button className="p-sm hover:bg-surface-container-high rounded-full transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface">account_circle</span>
            </button>
            <button className="md:hidden p-sm">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-[80px]">
        {/* Hero Section */}
        <section className="relative h-[870px] flex items-center overflow-hidden">
          <div className="max-w-container-max mx-auto px-lg md:px-xl relative z-10 w-full">
            <div className="max-w-2xl space-y-lg">
              <span className="inline-block px-md py-xs bg-primary-fixed text-on-primary-fixed font-label-md rounded-full">
                Curated for Connoisseurs
              </span>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight">
                Find Your Next <br /> <span className="italic font-normal">Great Adventure</span>
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-lg">
                Explore an exquisite collection of literary treasures, from modern masterpieces to timeless classics, delivered with intellectual serenity.
              </p>
              <div className="flex flex-col sm:flex-row gap-md pt-md">
                <button className="bg-primary text-white px-xl py-md rounded-lg font-label-md hover:shadow-lg active:scale-95 transition-all">
                  Shop Bestsellers
                </button>
                <button className="border border-primary text-primary px-xl py-md rounded-lg font-label-md hover:bg-primary/5 active:scale-95 transition-all">
                  Join the Club
                </button>
              </div>
            </div>
          </div>
          <div className="hidden xl:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-1/2">
            <div className="relative w-full aspect-[4/3] rounded-l-xxl overflow-hidden shadow-2xl border-l border-y border-outline-variant bg-surface-container-high flex items-center justify-center">
               <span className="text-secondary">Image Placeholder</span>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="max-w-container-max mx-auto px-lg md:px-xl py-xl overflow-hidden">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-sm text-headline-sm text-primary">Explore Genres</h2>
            <a className="font-label-md text-primary hover:underline decoration-primary/30" href="#">View All</a>
          </div>
          <div className="flex gap-sm overflow-x-auto pb-md scrollbar-hide no-scrollbar">
            <button className="px-lg py-sm rounded-full bg-primary text-white font-label-sm whitespace-nowrap transition-all shadow-md active:scale-95">All Collections</button>
            <button className="px-lg py-sm rounded-full bg-surface-container-high text-on-surface font-label-sm whitespace-nowrap hover:bg-primary-fixed transition-all active:scale-95">Fiction</button>
            <button className="px-lg py-sm rounded-full bg-surface-container-high text-on-surface font-label-sm whitespace-nowrap hover:bg-primary-fixed transition-all active:scale-95">Non-Fiction</button>
          </div>
        </section>

        {/* Book Grid */}
        <section className="max-w-container-max mx-auto px-lg md:px-xl mb-xxl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
            {[1, 2, 3, 4].map((book) => (
              <div key={book} className="group">
                <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-surface-container-high book-card-shadow transition-all duration-300 relative flex items-center justify-center">
                  <span className="text-secondary">Book Cover</span>
                  <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white/90 backdrop-blur p-xs rounded-full shadow-md text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                    </button>
                  </div>
                </div>
                <div className="mt-md space-y-xs">
                  <div className="flex items-center gap-xs text-primary mb-xs">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm">4.9</span>
                  </div>
                  <h3 className="font-headline-sm text-primary line-clamp-2 leading-tight">The Emerald Path</h3>
                  <p className="font-body-sm text-secondary">Evelyn Thorne</p>
                  <div className="flex items-center justify-between pt-sm">
                    <span className="font-label-md text-primary">$28.00</span>
                    <button onClick={addToCart} className="add-to-cart-btn p-xs bg-primary-container text-white rounded transition-colors hover:bg-primary active:scale-90">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full bg-surface-container-high border-t border-outline-variant mt-xxl">
        <div className="max-w-container-max mx-auto px-lg py-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
          <div className="space-y-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-2xl">explore</span>
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight">BookCompass</span>
            </div>
            <p className="font-body-sm text-secondary">© 2026 BookCompass. Crafted for the curious reader.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
