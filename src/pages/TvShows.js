import React from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { getPopular } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const TvShows = () => {
  const { data, loading, error } = useApiFetch(getPopular, 'tv', 1);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">Popular TV Shows</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data?.results?.map((show) => (
            <MovieCard key={show.id} media={{...show, media_type: 'tv'}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TvShows;
