'use client';

import React, { useState, useEffect } from 'react';

interface Review {
  id: number;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export default function BookReviews({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReviews = React.useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/book/${bookId}`);
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    const init = async () => {
      await fetchReviews();
    };
    init();
    
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          credentials: 'include'
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [bookId, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('Please select a rating');
    
    try {
      const res = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId, rating, comment }),
      });
      if (res.ok) {
        setRating(0);
        setComment('');
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-xl pt-lg border-t border-outline-variant/30">
      <h2 className="font-headline-md text-primary mb-md">Reviews</h2>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-surface-container-low p-md rounded-lg mb-lg shadow-sm">
          <h3 className="font-headline-sm text-on-surface mb-sm">Write a Review</h3>
          <div className="flex gap-xs mb-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <span 
                  className={`material-symbols-outlined text-[24px] ${star <= (hoverRating || rating) ? 'text-primary' : 'text-outline-variant'}`}
                  style={{ fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this book (optional)"
            className="w-full bg-surface-container border border-outline-variant rounded-md p-sm font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y min-h-[100px] mb-sm"
          />
          <button 
            type="submit"
            className="bg-primary text-white font-label-md px-lg py-sm rounded-full hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </form>
      ) : (
        <div className="bg-surface-container-low p-md rounded-lg mb-lg text-center">
          <p className="font-body-md text-secondary">Log in to share your thoughts about this book.</p>
        </div>
      )}

      <div className="space-y-md">
        {loading ? (
          <p className="text-secondary">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-surface-container-lowest p-md rounded-lg border border-outline-variant/20 shadow-sm">
              <div className="flex items-center gap-xs mb-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`material-symbols-outlined text-[16px] ${star <= rev.rating ? 'text-primary' : 'text-outline-variant'}`}
                    style={{ fontVariationSettings: star <= rev.rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
                <span className="font-label-sm text-secondary ml-sm">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
              {rev.comment && (
                <p className="font-body-md text-on-surface-variant whitespace-pre-wrap">{rev.comment}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-secondary italic">No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
}
