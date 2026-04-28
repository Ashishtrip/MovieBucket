import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { searchMedia } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        const data = await searchMedia(query, 1);
        if (isMounted) {
          // Filter out people, only show movies and tv shows
          const filteredResults = data.results.filter(
            (item) => item.media_type === 'movie' || item.media_type === 'tv'
          );
          setSearchResults({ ...data, results: filteredResults });
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Search failed');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSearch();
    return () => { isMounted = false; };
  }, [query]);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">
        Search Results for "{query}"
      </h1>
      
      {!query ? (
        <p className="text-gray-400">Please enter a search term.</p>
      ) : loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : searchResults?.results?.length === 0 ? (
        <p className="text-gray-400">No movies or TV shows found matching "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {searchResults?.results?.map((item) => (
            <MovieCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
