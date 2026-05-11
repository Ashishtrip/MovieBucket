import React from 'react';

/**
 * LoadingSpinner – a full-width centered spinner shown during data fetches.
 * Uses role="status" and aria-label so both users and tests can detect it.
 */
const LoadingSpinner = () => (
  <div
    className="flex justify-center items-center py-12"
    role="status"
    aria-label="Loading"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-themeGlow" />
    <span className="sr-only">Loading…</span>
  </div>
);

export default LoadingSpinner;
