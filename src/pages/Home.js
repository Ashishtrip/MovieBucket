import React from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { getTrending } from '../services/tmdbApi';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data: trendingMovies, loading: moviesLoading, error: moviesError } = useApiFetch(getTrending, 'movie', 'day');
  const { data: trendingTv, loading: tvLoading, error: tvError } = useApiFetch(getTrending, 'tv', 'day');

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-themeBase flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-themeBase via-themeBase/60 to-transparent z-10" />
        {trendingMovies?.results?.[0] && (
          <img
            src={`https://image.tmdb.org/t/p/original${trendingMovies.results[0].backdrop_path}`}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-themeAccent mb-6 drop-shadow-lg">
            Discover Your Next Favorite Story
          </h1>
          <p className="text-lg md:text-xl text-themeAccent mb-8 max-w-2xl mx-auto drop-shadow-md">
            Explore millions of movies and TV shows. Keep track of what you want to watch.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/movies" className="bg-themeAccent text-themeBase font-bold shadow-glow hover:bg-themeGlow transition duration-300 font-bold py-3 px-8 rounded-full transition shadow-lg">
              Browse Movies
            </Link>
            <Link to="/tv-shows" className="bg-themeBase border border-themeAccent hover:bg-themeGlow hover:text-themeBase text-themeAccent font-bold py-3 px-8 rounded-full transition shadow-lg">
              Explore TV
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-themeAccent border-l-4 border-themeGlow pl-3">Trending Movies</h2>
          <Link to="/movies" className="text-themeGlow hover:text-themeGlow hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition text-sm font-semibold">View All</Link>
        </div>
        
        {moviesLoading ? (
          <LoadingSpinner />
        ) : moviesError ? (
          <ErrorMessage message={moviesError} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingMovies?.results?.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} media={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Trending TV Shows Section */}
      <section className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-themeAccent border-l-4 border-themeGlow pl-3">Trending TV Shows</h2>
          <Link to="/tv-shows" className="text-themeGlow hover:text-themeGlow hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition text-sm font-semibold">View All</Link>
        </div>

        {tvLoading ? (
          <LoadingSpinner />
        ) : tvError ? (
          <ErrorMessage message={tvError} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingTv?.results?.slice(0, 6).map((show) => (
              <MovieCard key={show.id} media={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
