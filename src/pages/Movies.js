import React from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { getPopular } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Movies = () => {
  const { data, loading, error } = useApiFetch(getPopular, 'movie', 1);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-themeAccent mb-8 border-l-4 border-themeGlow pl-4">Popular Movies</h1>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data?.results?.map((movie) => (
            <MovieCard key={movie.id} media={{...movie, media_type: 'movie'}} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;
