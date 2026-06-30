"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('accessToken'));
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
          <Link href="/" className="font-headline-sm text-headline-sm text-primary tracking-tight">BookCompass</Link>
        </div>

        <div className="hidden lg:flex items-center gap-lg">
          <Link 
            className={`font-body-md pb-1 transition-colors ${pathname === '/' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary border-b-2 border-transparent'}`} 
            href="/"
          >
            Browse
          </Link>
          <a className="font-body-md text-secondary hover:text-primary transition-colors border-b-2 border-transparent pb-1" href="#">
            New Arrivals
          </a>
          <Link 
            className={`font-body-md pb-1 transition-colors ${pathname === '/bestsellers' ? 'text-primary border-b-2 border-primary' : 'text-secondary hover:text-primary border-b-2 border-transparent'}`} 
            href="/bestsellers"
          >
            Best Sellers
          </Link>
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
          {isAuthenticated ? (
            <button onClick={() => { localStorage.removeItem('accessToken'); setIsAuthenticated(false); window.location.reload(); }} className="font-label-md text-primary hover:bg-surface-container-high px-sm py-xs rounded transition-colors active:scale-95">
              Logout
            </button>
          ) : (
            <div className="flex gap-sm">
              <a href="/login" className="font-label-md text-primary hover:bg-surface-container-high px-sm py-xs rounded transition-colors flex items-center active:scale-95">Login</a>
              <a href="/register" className="font-label-md text-white bg-primary hover:shadow-lg px-md py-xs rounded transition-all flex items-center active:scale-95">Register</a>
            </div>
          )}
          <button className="md:hidden p-sm">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
