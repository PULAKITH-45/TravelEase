import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  description: string;
  category: string;
  weather: string;
  price: number;
};

type BookmarkContextType = {
  bookmarks: Destination[];
  addBookmark: (destination: Destination) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Destination[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const data = await AsyncStorage.getItem('bookmarks');
    if (data) setBookmarks(JSON.parse(data));
  };

  const saveBookmarks = async (updated: Destination[]) => {
    setBookmarks(updated);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const addBookmark = (destination: Destination) => {
    saveBookmarks([...bookmarks, destination]);
  };

  const removeBookmark = (id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some(b => b.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
};