import React from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";

async function getBooks() {
  try {
    const res = await fetch("http://localhost:8080/api/books", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();

  return (
    <div className="min-h-screen">
      <NavBar />

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
               <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop" alt="Hero Library" className="object-cover w-full h-full" />
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
            {books.length > 0 ? (
              books.map((book: any) => (
                <div key={book.id} className="group">
                  <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-surface-container-high book-card-shadow transition-all duration-300 relative flex items-center justify-center">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-secondary">Book Cover</span>
                    )}
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
                    <h3 className="font-headline-sm text-primary line-clamp-2 leading-tight">{book.title}</h3>
                    <p className="font-body-sm text-secondary">{book.author}</p>
                    <div className="flex items-center justify-between pt-sm">
                      <span className="font-label-md text-primary">${Number(book.price || 0).toFixed(2)}</span>
                      <button className="add-to-cart-btn p-xs bg-primary-container text-white rounded transition-colors hover:bg-primary active:scale-90">
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-secondary col-span-full">No books found in the catalog.</p>
            )}
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
