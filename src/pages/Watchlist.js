import React, { useContext } from 'react';
import { WatchlistContext } from '../context/WatchlistContext';
import { AuthContext } from '../context/AuthContext';
import MovieCard from '../components/UI/MovieCard';

const Watchlist = () => {
  const { watchlist } = useContext(WatchlistContext);
  const { logout } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-themeAccent border-l-4 border-themeGlow pl-4">My Watchlist</h1>
        <button 
          onClick={logout}
          className="text-sm bg-themeBase border border-themeAccent hover:bg-themeGlow hover:text-themeBase text-themeAccent py-2 px-4 rounded-full transition"
        >
          Log Out
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-themeAccent text-lg">Your watchlist is empty.</p>
          <p className="text-themeAccent mt-2">Start adding movies and TV shows you want to watch!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((item) => (
            <MovieCard key={item.id} media={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
