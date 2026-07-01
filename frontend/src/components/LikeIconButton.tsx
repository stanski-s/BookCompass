'use client';
import { useLikedBooks } from '@/context/LikedBooksContext';

export default function LikeIconButton({ bookId }: { bookId: number }) {
  const { likedBookIds, toggleLike } = useLikedBooks();
  const isLiked = likedBookIds.includes(bookId);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Prevents link navigation if wrapped in Link
        toggleLike(bookId);
      }}
      className="bg-white/90 backdrop-blur p-xs rounded-full shadow-md text-primary transition-transform active:scale-95"
    >
      <span 
        className="material-symbols-outlined" 
        style={{ fontVariationSettings: `'FILL' ${isLiked ? 1 : 0}` }}
      >
        favorite
      </span>
    </button>
  );
}
