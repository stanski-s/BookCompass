'use client';
import { useLikedBooks } from '@/context/LikedBooksContext';
import BookGallery from '@/components/BookGallery';
import { Book } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LikedBooksWrapper({ allBooks }: { allBooks: Book[] }) {
  const { likedBookIds, isLoading } = useLikedBooks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="text-center text-secondary py-xl">Loading your favorites...</div>;
  }

  const likedBooks = allBooks.filter(book => likedBookIds.includes(book.id));

  if (likedBooks.length === 0) {
    return (
      <div className="text-center py-xl space-y-md">
        <p className="text-secondary font-body-lg">You haven&apos;t liked any books yet.</p>
        <Link 
          href="/" 
          className="inline-block bg-primary text-white font-label-lg px-xl py-sm rounded-full hover:shadow-lg transition-all active:scale-95"
        >
          Go Explore
        </Link>
      </div>
    );
  }

  return <BookGallery books={likedBooks} />;
}
