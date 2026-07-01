'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface LikedBooksContextType {
  likedBookIds: number[];
  toggleLike: (bookId: number) => Promise<void>;
  isLoading: boolean;
}

const LikedBooksContext = createContext<LikedBooksContextType>({
  likedBookIds: [],
  toggleLike: async () => {},
  isLoading: true,
});

export const useLikedBooks = () => useContext(LikedBooksContext);

export const LikedBooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedBookIds, setLikedBookIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLikedBooks = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/liked-books', {
        credentials: 'include',
      });
      if (res.ok) {
        const ids = await res.json();
        setLikedBookIds(ids);
      } else {
        setLikedBookIds([]);
      }
    } catch (error) {
      console.error('Failed to fetch liked books', error);
      setLikedBookIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedBooks();
    
    // Also add a custom event for same-tab login/logout
    window.addEventListener('auth-change', fetchLikedBooks);
    
    return () => {
      window.removeEventListener('auth-change', fetchLikedBooks);
    };
  }, []);

  const toggleLike = async (bookId: number) => {
    // Optimistic update
    setLikedBookIds((prev) => 
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );

    try {
      const res = await fetch('http://localhost:8080/api/liked-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ bookId }),
      });
      
      if (!res.ok) {
        // Revert on failure
        fetchLikedBooks();
      }
    } catch (error) {
      console.error('Failed to toggle like', error);
      fetchLikedBooks();
    }
  };

  return (
    <LikedBooksContext.Provider value={{ likedBookIds, toggleLike, isLoading }}>
      {children}
    </LikedBooksContext.Provider>
  );
};
