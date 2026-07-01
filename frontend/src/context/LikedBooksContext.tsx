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
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLikedBookIds([]);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/liked-books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const ids = await res.json();
        setLikedBookIds(ids);
      }
    } catch (error) {
      console.error('Failed to fetch liked books', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLikedBooks();
    
    // Re-fetch when localStorage changes (e.g. login/logout in another tab)
    const handleStorageChange = () => fetchLikedBooks();
    window.addEventListener('storage', handleStorageChange);
    
    // Also add a custom event for same-tab login/logout
    window.addEventListener('auth-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  const toggleLike = async (bookId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Optimistic update
    setLikedBookIds((prev) => 
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );

    try {
      const res = await fetch('http://localhost:8080/api/liked-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
