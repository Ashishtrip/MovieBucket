import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Film } from 'lucide-react';
import { WatchlistContext } from '../context/WatchlistContext';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/UI/Button';

/**
 * WatchlistItem – renders a single item with an animated remove action.
 * The card fades out before the item is actually removed from state.
 *
 * @param {Object}   props
 * @param {Object}   props.item     - The media item to display.
 * @param {Function} props.onRemove - Called after the fade animation ends.
 */
const WatchlistItem = ({ item, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  const imgBaseUrl = 'https://image.tmdb.org/t/p/w342';
  const title = item.title || item.name || 'Untitled';
  const year = item.release_date || item.first_air_date
    ? new Date(item.release_date || item.first_air_date).getFullYear()
    : 'N/A';
  const type = item.media_type === 'tv' ? 'tv-show' : 'movie';

  const handleRemoveClick = () => {
    setRemoving(true);
    // Wait for CSS animation to finish before removing from context
    setTimeout(() => onRemove(item.id), 350);
  };

  return (
    <div
      role="listitem"
      className={`relative group bg-themeBase rounded-xl overflow-hidden shadow-lg border border-themeAccent/10 transition-all duration-350 ${
        removing
          ? 'opacity-0 scale-95 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{ transition: 'opacity 0.35s ease, transform 0.35s ease' }}
    >
      {/* Poster / link */}
      <Link
        to={`/${type}/${item.id}`}
        aria-label={`View details for ${title}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded-xl"
      >
        <div className="relative aspect-[2/3] w-full">
          {item.poster_path ? (
            <img
              src={`${imgBaseUrl}${item.poster_path}`}
              alt={`${title} poster`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-themeBase text-themeAccent/50 text-xs">
              No Image
            </div>
          )}
        </div>
        <div className="p-3">
          <h3
            className="text-themeAccent font-semibold text-sm truncate"
            title={title}
          >
            {title}
          </h3>
          <p className="text-themeAccent/60 text-xs mt-0.5">{year}</p>
        </div>
      </Link>

      {/* Remove button – appears on hover / focus */}
      <button
        aria-label={`Remove ${title} from watchlist`}
        onClick={handleRemoveClick}
        className="absolute top-2 left-2 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

/**
 * Watchlist page – lists all saved media items with animated removals.
 * Only accessible to authenticated users (guarded by ProtectedRoute).
 */
const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);
  const { logout } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 min-h-[70vh]">
      {/* Page header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-themeAccent border-l-4 border-themeGlow pl-4">
          My Watchlist
        </h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={logout}
          aria-label="Log out of your account"
          id="watchlist-logout-btn"
        >
          Log Out
        </Button>
      </div>

      {watchlist.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center text-center py-24 gap-6"
          role="status"
          aria-live="polite"
        >
          <Film className="w-16 h-16 text-themeAccent/30" aria-hidden="true" />
          <div>
            <p className="text-themeAccent text-xl font-semibold">
              Your watchlist is empty.
            </p>
            <p className="text-themeAccent/60 mt-2 text-sm">
              Browse movies and TV shows and add them here to watch later.
            </p>
          </div>
          <Link
            to="/movies"
            className="mt-2 text-themeGlow font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded"
          >
            Discover Movies →
          </Link>
        </div>
      ) : (
        /* Grid */
        <div
          role="list"
          aria-label="Your watchlist"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
        >
          {watchlist.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onRemove={removeFromWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
