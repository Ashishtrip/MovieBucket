import React, { useState } from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { getPopular } from '../services/tmdbApi';
import MediaGrid from '../components/UI/MediaGrid';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

/**
 * TvShows page – displays paginated popular TV shows fetched from TMDB.
 * Scrolls to the top of the page on every page change.
 */
const TvShows = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useApiFetch(getPopular, 'tv', currentPage);

  /** Change page and scroll the user back to the heading. */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Defensive: guard against missing or malformed API results
  const results = Array.isArray(data?.results) ? data.results : [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-themeAccent mb-8 border-l-4 border-themeGlow pl-4">
        Popular TV Shows
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : results.length === 0 ? (
        <p className="text-themeAccent" role="status">
          No TV shows found.
        </p>
      ) : (
        <>
          <MediaGrid
            items={results.map((s) => ({ ...s, media_type: 'tv' }))}
            ariaLabel="Popular TV shows"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TvShows;
