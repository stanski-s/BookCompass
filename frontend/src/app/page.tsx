import React from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import BookGallery from "@/components/BookGallery";

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

        <BookGallery books={books} />
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
