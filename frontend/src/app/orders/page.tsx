'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: number;
  bookId: number;
  quantity: number;
  priceAtPurchase: string | number;
  book?: {
    title: string;
    author: string;
    coverUrl?: string;
  };
}

interface Order {
  id: string;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:8080/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const fetchedOrders: Order[] = await res.json();

          const enhancedOrders = await Promise.all(
            fetchedOrders.map(async (order) => {
              const enhancedItems = await Promise.all(
                order.items.map(async (item) => {
                  try {
                    const bookRes = await fetch(
                      `http://localhost:8080/api/books/${item.bookId}`,
                    );
                    if (bookRes.ok) {
                      item.book = await bookRes.json();
                    }
                  } catch (e) {
                    console.error('Failed to fetch book for order item', e);
                  }
                  return item;
                }),
              );
              return { ...order, items: enhancedItems };
            }),
          );

          enhancedOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          setOrders(enhancedOrders);
        } else if (res.status === 401) {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="min-h-screen bg-background pb-xxl">
      <NavBar />

      <main className="pt-[120px] max-w-container-max mx-auto px-lg md:px-xl">
        <h1 className="font-headline-lg text-primary mb-xl">Your Orders</h1>

        {loading ? (
          <div className="flex justify-center py-xl">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">
              autorenew
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-xxl bg-surface-container-low rounded-xl border border-outline-variant/30 shadow-sm">
            <span className="material-symbols-outlined text-[64px] text-outline mb-md block">
              receipt_long
            </span>
            <h2 className="font-headline-md text-secondary mb-sm">
              No orders found
            </h2>
            <p className="font-body-md text-on-surface-variant mb-lg">
              You haven&apos;t made any purchases yet.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary text-white px-xl py-sm rounded-lg hover:shadow-lg transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-lg">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden"
              >
                <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant/30 flex flex-wrap justify-between items-center gap-md">
                  <div>
                    <p className="font-body-sm text-on-surface-variant">
                      Order Placed
                    </p>
                    <p className="font-headline-sm text-primary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-body-sm text-on-surface-variant">
                      Total
                    </p>
                    <p className="font-headline-sm text-primary">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="font-body-sm text-on-surface-variant">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right flex-grow md:flex-grow-0">
                    <p className="font-body-sm text-on-surface-variant">
                      Order #
                    </p>
                    <p className="font-label-md text-secondary font-mono">
                      {order.id.split('-')[0]}
                    </p>
                  </div>
                </div>

                <div className="p-lg space-y-md">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-md items-center">
                      <div className="w-16 h-24 relative rounded-md overflow-hidden bg-surface-container flex-shrink-0 shadow-sm">
                        {item.book?.coverUrl ? (
                          <Image
                            src={item.book.coverUrl}
                            alt={item.book.title || 'Book cover'}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-secondary text-center">
                            No Cover
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-headline-sm text-primary line-clamp-1">
                          {item.book?.title || 'Unknown Book'}
                        </h4>
                        <p className="font-body-sm text-secondary mb-1">
                          {item.book?.author || 'Unknown Author'}
                        </p>
                        <div className="font-body-sm text-on-surface-variant flex gap-4 mt-2">
                          <span className="bg-surface-container px-2 py-1 rounded-md">
                            Qty:{' '}
                            <span className="font-bold text-on-surface">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="bg-surface-container px-2 py-1 rounded-md">
                            Price:{' '}
                            <span className="font-bold text-on-surface">
                              ${Number(item.priceAtPurchase).toFixed(2)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
