import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MovieCard = React.memo(({ media }) => {
  // TMDB image base URL
  const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const type = media.media_type === 'tv' ? 'tv-show' : 'movie';

  return (
    <Link to={`/${type}/${media.id}`} className="group relative block w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative aspect-[2/3] w-full bg-gray-700">
        {media.poster_path ? (
          <img
            src={`${imgBaseUrl}${media.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {media.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1 text-yellow-500 text-xs font-bold">
            <Star className="w-3 h-3 fill-current" />
            <span>{media.vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-gray-100 font-semibold text-base truncate" title={title}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm mt-1">{year}</p>
      </div>
    </Link>
  );
});

export default MovieCard;
