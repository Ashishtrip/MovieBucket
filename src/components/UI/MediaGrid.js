import React from 'react';
import MovieCard from './MovieCard';

/**
 * MediaGrid renders a responsive grid of MovieCard items.
 * Centralises the grid layout so all list pages look consistent.
 *
 * @param {Object} props
 * @param {Array}  props.items       - Array of TMDB media objects.
 * @param {string} [props.ariaLabel] - Accessible label for the grid region.
 */
const MediaGrid = ({ items = [], ariaLabel = 'Media list' }) => {
  if (!items.length) return null;

  return (
    <section
      aria-label={ariaLabel}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      {items.map((media) => (
        <MovieCard key={media.id} media={media} />
      ))}
    </section>
  );
};

export default MediaGrid;
