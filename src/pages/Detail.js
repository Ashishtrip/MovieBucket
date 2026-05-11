import React, { useContext, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { getDetails } from '../services/tmdbApi';
import { WatchlistContext } from '../context/WatchlistContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import Toast from '../components/UI/Toast';
import Button from '../components/UI/Button';
import { Star, Plus, Check, PlayCircle } from 'lucide-react';

/**
 * Detail page – shows full information for a single movie or TV show.
 * Handles missing/incomplete API data gracefully throughout.
 */
const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  // Determine media type from the URL path segment
  const type = location.pathname.includes('tv-show') ? 'tv' : 'movie';

  const { data: media, loading, error } = useApiFetch(getDetails, type, id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext);

  const [toastMessage, setToastMessage] = useState(null);
  const [watchlistAnimating, setWatchlistAnimating] = useState(false);

  const mediaId = Number(id);
  const isSaved = isInWatchlist(mediaId);

  /**
   * Toggle the item in/out of the watchlist with a brief button animation.
   */
  const handleWatchlistToggle = () => {
    setWatchlistAnimating(true);
    setTimeout(() => setWatchlistAnimating(false), 300);

    if (isSaved) {
      removeFromWatchlist(mediaId);
      setToastMessage('Removed from Watchlist');
    } else if (media) {
      // Only store the fields we actually need to keep localStorage lean
      const itemToSave = {
        id: media.id,
        title: media.title || media.name || 'Untitled',
        poster_path: media.poster_path || null,
        vote_average: typeof media.vote_average === 'number' ? media.vote_average : 0,
        release_date: media.release_date || media.first_air_date || null,
        media_type: type,
      };
      addToWatchlist(itemToSave);
      setToastMessage('Added to Watchlist!');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  // Guard: API can return null/undefined for unknown IDs
  if (!media || typeof media !== 'object') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-themeAccent text-lg">
          Could not load details. The title may not exist or was removed.
        </p>
      </div>
    );
  }

  const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const backdropUrl = media.backdrop_path
    ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
    : null;

  const title = media.title || media.name || 'Untitled';
  const year = (media.release_date || media.first_air_date)?.split('-')[0] ?? 'N/A';
  const rating = typeof media.vote_average === 'number' ? media.vote_average : 0;

  // Runtime: movies have `runtime` (minutes), TV shows have `episode_run_time` (array)
  let runtime = '';
  if (media.runtime && media.runtime > 0) {
    runtime = `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`;
  } else if (Array.isArray(media.episode_run_time) && media.episode_run_time[0]) {
    runtime = `${media.episode_run_time[0]}m / ep`;
  }

  const genres = Array.isArray(media.genres)
    ? media.genres.map((g) => g?.name).filter(Boolean).join(', ')
    : '';

  // First YouTube trailer, if present
  const trailer = Array.isArray(media.videos?.results)
    ? media.videos.results.find(
        (v) => v?.site === 'YouTube' && v?.type === 'Trailer'
      ) ?? media.videos.results[0]
    : null;

  // Top 8 cast members with valid names
  const cast = Array.isArray(media.credits?.cast)
    ? media.credits.cast.filter((a) => a?.name).slice(0, 8)
    : [];

  return (
    <div className="relative pb-20">
      {/* Toast notification for watchlist actions */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Backdrop Hero */}
      <div
        className="relative h-[50vh] md:h-[60vh] w-full"
        role="img"
        aria-label={backdropUrl ? `${title} backdrop` : 'No backdrop available'}
      >
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-themeBase" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-themeBase via-themeBase/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 -mt-32 md:-mt-48 relative z-10 flex flex-col md:flex-row gap-8">

        {/* Poster */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-48 md:w-72 shadow-2xl rounded-xl overflow-hidden border border-themeAccent/20 bg-themeBase">
          {media.poster_path ? (
            <img
              src={`${imgBaseUrl}${media.poster_path}`}
              alt={`${title} poster`}
              className="w-full h-auto block"
            />
          ) : (
            <div className="w-full aspect-[2/3] flex items-center justify-center text-themeAccent/50 text-sm">
              No Poster
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
          <h1 className="text-3xl md:text-5xl font-bold text-themeAccent drop-shadow-md mb-2">
            {title}{' '}
            <span className="text-themeAccent/60 font-normal text-2xl md:text-4xl">
              ({year})
            </span>
          </h1>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-themeAccent mb-6"
            aria-label="Media details"
          >
            {rating > 0 && (
              <span className="flex items-center text-yellow-500 font-bold bg-themeBase px-2 py-1 rounded">
                <Star className="w-4 h-4 mr-1 fill-current" aria-hidden="true" />
                <span aria-label={`Rating: ${rating.toFixed(1)} out of 10`}>
                  {rating.toFixed(1)}
                </span>
              </span>
            )}
            {runtime && <span>{runtime}</span>}
            {genres && (
              <>
                <span className="hidden md:inline" aria-hidden="true">•</span>
                <span>{genres}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mb-8 flex justify-center md:justify-start space-x-4 flex-wrap gap-y-3">
            <Button
              variant={isSaved ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleWatchlistToggle}
              aria-label={isSaved ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
              aria-pressed={isSaved}
              id="watchlist-toggle-btn"
              className={`transform ${watchlistAnimating ? 'scale-95' : 'scale-100'}`}
              style={{ transition: 'transform 0.15s ease' }}
            >
              {isSaved ? (
                <>
                  <Check className="w-5 h-5 mr-2" aria-hidden="true" />
                  In Watchlist
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                  Add to Watchlist
                </>
              )}
            </Button>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${title} trailer on YouTube`}
                className="flex items-center px-6 py-3 rounded-full font-bold bg-themeAccent text-themeBase hover:bg-themeGlow transition shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow focus-visible:ring-offset-2 focus-visible:ring-offset-themeBase"
              >
                <PlayCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                Trailer
              </a>
            )}
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-themeAccent mb-2">Overview</h2>
            <p className="text-themeAccent/80 leading-relaxed max-w-3xl text-sm md:text-base">
              {media.overview?.trim() || 'No overview available for this title.'}
            </p>
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-themeAccent mb-4 border-l-4 border-themeGlow pl-3">
                Top Cast
              </h2>
              <div
                className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar"
                role="list"
                aria-label="Cast members"
              >
                {cast.map((actor) => (
                  <div
                    key={actor.cast_id ?? actor.id}
                    role="listitem"
                    className="flex-shrink-0 w-24 md:w-32 text-center"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-2 bg-themeBase/50 mx-auto">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-themeAccent/50">
                          No Img
                        </div>
                      )}
                    </div>
                    <p className="text-themeAccent text-xs md:text-sm font-semibold truncate">
                      {actor.name}
                    </p>
                    <p className="text-themeAccent/60 text-xs truncate">
                      {actor.character || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
