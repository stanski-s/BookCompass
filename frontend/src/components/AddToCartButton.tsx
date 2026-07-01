"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ bookId }: { bookId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bookId, quantity: 1 }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        // Optionally show a toast here
      } else {
        if (res.status === 401) {
          router.push('/login');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-primary text-white px-xl py-sm rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-container disabled:opacity-50 active:scale-95 transition-all font-label-md flex items-center gap-sm"
    >
      <span className="material-symbols-outlined text-[20px]">
        {loading ? 'hourglass_empty' : 'shopping_cart'}
      </span>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
