import React, { createContext, useState, useEffect } from 'react';

export const WatchlistContext = createContext();

/** Storage key for the watchlist in localStorage */
const WATCHLIST_KEY = 'watchlist';

/**
 * Safely reads JSON from localStorage, returning a fallback on any error
 * (e.g. QuotaExceededError, SecurityError, or JSON parse failure).
 * @param {string} key - localStorage key.
 * @param {*} fallback - Value to return on failure.
 */
const safeRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn('[WatchlistContext] localStorage read error:', err);
    return fallback;
  }
};

/**
 * Safely writes JSON to localStorage.
 * Silently handles quota-exceeded and security errors so the app never crashes.
 * @param {string} key - localStorage key.
 * @param {*} value - Serialisable value to store.
 * @returns {boolean} true if successful, false otherwise.
 */
const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // DOMException: QuotaExceededError or SecurityError
    console.warn('[WatchlistContext] localStorage write failed:', err);
    return false;
  }
};

/**
 * WatchlistProvider stores the user's watchlist both in React state and
 * in localStorage so it persists across page reloads.
 */
export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() =>
    safeRead(WATCHLIST_KEY, [])
  );

  /** Persist watchlist to localStorage whenever it changes. */
  useEffect(() => {
    const ok = safeWrite(WATCHLIST_KEY, watchlist);
    if (!ok) {
      // Optionally trim the list or notify the user
      console.warn('[WatchlistContext] Could not persist watchlist – storage may be full.');
    }
  }, [watchlist]);

  /**
   * Add a media item to the watchlist (no-op if already present).
   * @param {Object} item - The media item with at minimum an `id` field.
   */
  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  /**
   * Remove a media item from the watchlist by id.
   * @param {number} id - The TMDB media id to remove.
   */
  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Returns true if a media item with the given id is in the watchlist.
   * @param {number} id - The TMDB media id to check.
   */
  const isInWatchlist = (id) => watchlist.some((item) => item.id === id);

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
