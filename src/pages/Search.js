import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { searchMedia } from '../services/tmdbApi';
import MediaGrid from '../components/UI/MediaGrid';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

/**
 * Search page – fetches and paginates multi-search results from TMDB.
 * Only movies and TV shows are shown (people are filtered out).
 * Re-runs the search whenever the query or page changes.
 */
const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await searchMedia(query, currentPage);

        if (isMounted) {
          // Guard against unexpected API shapes
          if (!data || !Array.isArray(data.results)) {
            throw new Error('Unexpected response from search API.');
          }

          // Filter to movies and TV shows only
          const filtered = data.results.filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          setSearchResults({ ...data, results: filtered });
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Search failed. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();
    return () => {
      isMounted = false;
    };
  }, [query, currentPage]);

  /** Change page and scroll to the top. */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const results = searchResults?.results ?? [];
  const totalPages = searchResults?.total_pages ?? 1;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-themeAccent mb-8 border-l-4 border-themeGlow pl-4">
        {query ? `Search Results for "${query}"` : 'Search'}
      </h1>

      {!query ? (
        <p className="text-themeAccent" role="status">
          Please enter a search term above.
        </p>
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : results.length === 0 ? (
        <p className="text-themeAccent" role="status">
          No movies or TV shows found matching &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          <MediaGrid items={results} ariaLabel={`Search results for ${query}`} />
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

export default Search;
