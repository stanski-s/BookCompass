'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/types';

import AddToCartIconButton from './AddToCartIconButton';
import LikeIconButton from './LikeIconButton';

export default function BookGallery({ books }: { books: Book[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach(b => {
      if (b.categories && Array.isArray(b.categories)) {
        b.categories.forEach((c: string) => cats.add(c));
      }
    });
    return Array.from(cats).sort();
  }, [books]);

  const filteredBooks = selectedCategory === 'All' 
    ? books 
    : books.filter(b => b.categories?.includes(selectedCategory));

  return (
    <>
      {/* Category Filter */}
      <section className="max-w-container-max mx-auto px-lg md:px-xl py-xl overflow-hidden">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="font-headline-sm text-headline-sm text-primary">Explore Genres</h2>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="font-label-md text-primary hover:underline decoration-primary/30"
          >
            View All
          </button>
        </div>
        <div className="flex gap-sm overflow-x-auto pb-md scrollbar-hide no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-lg py-sm rounded-full font-label-sm whitespace-nowrap transition-all active:scale-95 ${selectedCategory === 'All' ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-on-surface hover:bg-primary-fixed'}`}
          >
            All Collections
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-lg py-sm rounded-full font-label-sm whitespace-nowrap transition-all active:scale-95 ${selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-on-surface hover:bg-primary-fixed'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Book Grid */}
      <section className="max-w-container-max mx-auto px-lg md:px-xl mb-xxl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book: Book) => (
              <div key={book.id} className="group">
                <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-surface-container-high book-card-shadow transition-all duration-300 relative flex items-center justify-center">
                  {book.coverUrl ? (
                    <Link href={`/books/${book.id}`} className="w-full h-full block">
                      <Image src={book.coverUrl} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    </Link>
                  ) : (
                    <span className="text-secondary">Book Cover</span>
                  )}
                  <div className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <LikeIconButton bookId={book.id} />
                  </div>
                </div>
                <div className="mt-md space-y-xs">
                  <div className="flex items-center gap-xs text-primary mb-xs">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm">
                      {book.averageRating && book.averageRating > 0 ? `${book.averageRating.toFixed(1)} (${book.reviewCount})` : 'New'}
                    </span>
                  </div>
                  <Link href={`/books/${book.id}`} className="hover:underline">
                    <h3 className="font-headline-sm text-primary line-clamp-2 leading-tight">{book.title}</h3>
                  </Link>
                  <p className="font-body-sm text-secondary">{book.author}</p>
                  <div className="flex items-center justify-between pt-sm">
                    <span className="font-label-md text-primary">${Number(book.price || 0).toFixed(2)}</span>
                    <AddToCartIconButton bookId={book.id} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-secondary col-span-full">No books found in this category.</p>
          )}
        </div>
      </section>
    </>
  );
}
