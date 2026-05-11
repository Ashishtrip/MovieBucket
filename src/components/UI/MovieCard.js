import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

/**
 * MovieCard displays a movie or TV show poster, title, year, and rating.
 * It is keyboard-navigable (standard <Link> semantics) and announces
 * its content to screen readers via descriptive aria-label.
 *
 * @param {Object} props
 * @param {Object} props.media - A TMDB movie or TV show result object.
 */
const MovieCard = React.memo(({ media }) => {
  // Guard against missing or null media prop
  if (!media) return null;

  const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';

  const title = media.title || media.name || 'Untitled';
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = typeof media.vote_average === 'number' ? media.vote_average : 0;
  const type = media.media_type === 'tv' ? 'tv-show' : 'movie';

  const ariaLabel = `${title} (${year})${rating > 0 ? `, rated ${rating.toFixed(1)}` : ''}`;

  return (
    <Link
      to={`/${type}/${media.id}`}
      aria-label={ariaLabel}
      className="group relative block w-full bg-themeBase rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow focus-visible:ring-offset-2 focus-visible:ring-offset-themeBase"
    >
      <div className="relative aspect-[2/3] w-full bg-themeBase/50">
        {media.poster_path ? (
          <img
            src={`${imgBaseUrl}${media.poster_path}`}
            alt={`${title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-themeAccent/50 gap-2"
            aria-label="No image available"
          >
            <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Rating badge */}
        {rating > 0 && (
          <div
            aria-hidden="true"
            className="absolute top-2 right-2 bg-themeBase/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1 text-yellow-500 text-xs font-bold"
          >
            <Star className="w-3 h-3 fill-current" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="text-themeAccent font-semibold text-base truncate"
          title={title}
        >
          {title}
        </h3>
        <p className="text-themeAccent/70 text-sm mt-1">{year}</p>
      </div>
    </Link>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
