import NavBar from '@/components/NavBar';
import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/lib/types';

import AddToCartIconButton from '@/components/AddToCartIconButton';

async function getBestsellers() {
  try {
    const res = await fetch('http://localhost:8080/api/books/bestsellers', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch bestsellers:', error);
    return [];
  }
}

export default async function BestsellersPage() {
  const books = await getBestsellers();

  return (
    <div className="min-h-screen bg-background pb-xxl">
      <NavBar />
      
      <main className="pt-[120px] max-w-container-max mx-auto px-lg md:px-xl">
        <header className="mb-xl text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Bestsellers</h1>
          <p className="font-body-lg text-secondary max-w-2xl mx-auto">
            Discover the most beloved books in our collection, chosen by readers like you.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
            {books.length > 0 ? (
              books.map((book: Book) => (
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
              <p className="text-secondary col-span-full text-center">No bestsellers found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
