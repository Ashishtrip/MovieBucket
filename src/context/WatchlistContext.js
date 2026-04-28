import React, { createContext, useState, useEffect } from 'react';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    // Load initial state from local storage
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Save to local storage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (item) => {
    setWatchlist((prevList) => {
      // Check if item is already in watchlist to prevent duplicates
      if (prevList.some((i) => i.id === item.id)) {
        return prevList;
      }
      return [...prevList, item];
    });
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prevList) => prevList.filter((item) => item.id !== id));
  };

  const isInWatchlist = (id) => {
    return watchlist.some((item) => item.id === id);
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
