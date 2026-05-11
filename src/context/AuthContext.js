import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

/** Key used to persist auth state in localStorage */
const AUTH_STORAGE_KEY = 'netfilm_auth';

/**
 * Safely reads a value from localStorage, returning a fallback on any error.
 * @param {string} key - The storage key to read.
 * @param {*} fallback - Value returned on failure.
 */
const safeLocalStorageGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn('[AuthContext] localStorage read failed:', err);
    return fallback;
  }
};

/**
 * Safely writes a value to localStorage, silently swallowing quota errors.
 * @param {string} key - The storage key to write.
 * @param {*} value - The value to store.
 */
const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // DOMException: QuotaExceededError or SecurityError
    console.warn('[AuthContext] localStorage write failed:', err);
  }
};

/**
 * AuthProvider manages mock authentication state with localStorage persistence.
 * The `isAuthenticated` flag survives page reloads.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    safeLocalStorageGet(AUTH_STORAGE_KEY, false)
  );

  // Keep localStorage in sync whenever auth state changes.
  // Write `true` when authenticated; remove the key when not (so that
  // getItem returns null after logout rather than "false").
  useEffect(() => {
    if (isAuthenticated) {
      safeLocalStorageSet(AUTH_STORAGE_KEY, true);
    } else {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (err) {
        console.warn('[AuthContext] localStorage remove failed:', err);
      }
    }
  }, [isAuthenticated]);

  /** Log the user in (mock – no real credentials required). */
  const login = () => setIsAuthenticated(true);

  /** Clear authentication state; the effect above removes the storage key. */
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
