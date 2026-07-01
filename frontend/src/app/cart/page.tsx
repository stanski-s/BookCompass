"use client";

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  bookId: number;
  quantity: number;
  book?: {
    title: string;
    author: string;
    price: string | number;
    coverUrl?: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartAndBooks = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const items: CartItem[] = await res.json();
          
          // Fetch book details for each item
          const itemsWithBooks = await Promise.all(
            items.map(async (item) => {
              const bookRes = await fetch(`http://localhost:8080/api/books/${item.bookId}`);
              if (bookRes.ok) {
                item.book = await bookRes.json();
              }
              return item;
            })
          );
          
          setCartItems(itemsWithBooks);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch cart', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndBooks();
  }, [router]);

  const handleCheckout = async () => {
    const token = localStorage.getItem('accessToken');
    setCheckoutLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        router.push('/orders'); // Redirect to orders page after successful checkout
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error', err);
      alert('An error occurred during checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleRemove = async (bookId: number) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`http://localhost:8080/api/cart/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems(prev => prev.filter(item => item.bookId !== bookId));
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        alert('Failed to remove item');
      }
    } catch (err) {
      console.error('Remove error', err);
    }
  };

  const handleUpdateQuantity = async (bookId: number, change: number, currentQuantity: number) => {
    if (currentQuantity + change <= 0) {
      handleRemove(bookId);
      return;
    }
    
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('http://localhost:8080/api/cart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ bookId, quantity: change })
      });
      
      if (res.ok) {
        setCartItems(prev => prev.map(item => 
          item.bookId === bookId 
            ? { ...item, quantity: item.quantity + change }
            : item
        ));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Update quantity error', err);
    }
  };
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.book?.price ? Number(item.book.price) : 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-xxl">
      <NavBar />
      
      <main className="pt-[120px] max-w-container-max mx-auto px-lg md:px-xl">
        <h1 className="font-headline-lg text-primary mb-xl">Your Cart</h1>

        {loading ? (
          <div className="flex justify-center py-xl">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-xxl bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-[64px] text-outline mb-md block">production_quantity_limits</span>
            <h2 className="font-headline-md text-secondary mb-sm">Your cart is empty</h2>
            <p className="font-body-md text-on-surface-variant mb-lg">Looks like you haven&apos;t added any books yet.</p>
            <button onClick={() => router.push('/')} className="bg-primary text-white px-xl py-sm rounded-lg hover:shadow-lg transition-all">
              Browse Books
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-xl">
            {/* Cart Items List */}
            <div className="flex-1 space-y-md">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-md bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm">
                  <div className="w-24 h-32 relative rounded-md overflow-hidden bg-surface-container flex-shrink-0">
                    {item.book?.coverUrl ? (
                      <Image src={item.book.coverUrl} alt={item.book.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-secondary">No Cover</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-headline-sm text-primary line-clamp-1">{item.book?.title || 'Unknown Book'}</h3>
                        <button onClick={() => handleRemove(item.bookId)} className="text-secondary hover:text-red-500 transition-colors" title="Remove item">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                      <p className="font-body-sm text-secondary">{item.book?.author || 'Unknown Author'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1 border border-outline-variant/30">
                        <button 
                          onClick={() => handleUpdateQuantity(item.bookId, -1, item.quantity)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-primary rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-bold text-on-surface text-sm w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.bookId, 1, item.quantity)}
                          className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:text-primary rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                      <div className="font-headline-sm text-primary">
                        ${(Number(item.book?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30 shadow-sm sticky top-[120px]">
                <h3 className="font-headline-md text-primary mb-md pb-sm border-b border-outline-variant/30">Order Summary</h3>
                
                <div className="space-y-sm mb-lg">
                  <div className="flex justify-between font-body-md text-secondary">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-secondary">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-headline-sm text-primary mb-xl pt-sm border-t border-outline-variant/30">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-primary text-white py-md rounded-lg shadow-md hover:shadow-lg hover:bg-primary-container disabled:opacity-50 active:scale-95 transition-all font-label-lg flex justify-center items-center gap-sm"
                >
                  {checkoutLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  )}
                  {checkoutLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
