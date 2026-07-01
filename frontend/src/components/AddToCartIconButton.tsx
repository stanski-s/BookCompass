"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartIconButton({ bookId }: { bookId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
      } else if (res.status === 401) {
        router.push('/login');
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
      className="add-to-cart-btn p-xs bg-primary-container text-white rounded transition-colors hover:bg-primary active:scale-90 disabled:opacity-50"
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
      ) : (
        <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
      )}
    </button>
  );
}
