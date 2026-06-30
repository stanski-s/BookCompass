import React from 'react';
import NavBar from '@/components/NavBar';
import Image from 'next/image';

async function getBook(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/books/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export default async function BookDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const book = await getBook(params.id);

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="pt-[120px] max-w-container-max mx-auto px-lg text-center">
          <h1 className="text-2xl text-primary font-headline-md">Book not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-xxl">
      <NavBar />
      
      <main className="pt-[120px] max-w-container-max mx-auto px-lg md:px-xl">
        <div className="flex flex-col md:flex-row gap-xl">
          {/* Left: Book Cover */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-surface-container-high shadow-2xl relative">
              {book.coverUrl ? (
                <Image src={book.coverUrl} alt={book.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-secondary">No Cover</div>
              )}
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-lg">
            <div>
              <div className="flex items-center gap-xs text-primary mb-sm">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-md">4.9 (128 reviews)</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary leading-tight mb-xs">{book.title}</h1>
              <p className="font-body-lg text-secondary text-xl">{book.author}</p>
            </div>

            <div className="py-md border-y border-outline-variant/30 flex items-center justify-between max-w-sm">
              <span className="font-headline-md text-primary">${Number(book.price || 0).toFixed(2)}</span>
              <button className="bg-primary text-white px-xl py-sm rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-container active:scale-95 transition-all font-label-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                Add to Cart
              </button>
            </div>

            <div className="space-y-sm pt-sm">
              <h3 className="font-headline-sm text-primary">Description</h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed max-w-3xl">
                {book.description || "No description available for this book."}
              </p>
            </div>

            {book.categories && book.categories.length > 0 && (
              <div className="pt-sm">
                <h3 className="font-headline-sm text-primary mb-md">Categories</h3>
                <div className="flex gap-sm flex-wrap">
                  {book.categories.map((cat: string) => (
                    <span key={cat} className="px-md py-xs rounded-full bg-surface-container-high text-on-surface font-label-sm shadow-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
