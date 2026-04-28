import React, { useContext, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { getDetails } from '../services/tmdbApi';
import { WatchlistContext } from '../context/WatchlistContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import Toast from '../components/UI/Toast';
import { Star, Plus, Check, PlayCircle } from 'lucide-react';

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  // Determine type based on URL path
  const type = location.pathname.includes('tv-show') ? 'tv' : 'movie';
  
  const { data: media, loading, error } = useApiFetch(getDetails, type, id);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext);
  
  const [toastMessage, setToastMessage] = useState(null);
  
  const isSaved = isInWatchlist(Number(id));

  const handleWatchlistToggle = () => {
    if (isSaved) {
      removeFromWatchlist(Number(id));
      setToastMessage('Removed from Watchlist');
    } else {
      if (media) {
        // Prepare a simplified object to store in watchlist
        const itemToSave = {
          id: media.id,
          title: media.title || media.name,
          poster_path: media.poster_path,
          vote_average: media.vote_average,
          release_date: media.release_date || media.first_air_date,
          media_type: type
        };
        addToWatchlist(itemToSave);
        setToastMessage('Added to Watchlist!');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!media) return null;

  const imgBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const backdropUrl = media.backdrop_path ? `https://image.tmdb.org/t/p/original${media.backdrop_path}` : null;
  const title = media.title || media.name;
  const year = (media.release_date || media.first_air_date)?.split('-')[0] || 'N/A';
  const runtime = media.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : (media.episode_run_time?.[0] ? `${media.episode_run_time[0]}m` : '');

  return (
    <div className="relative pb-20">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Backdrop Hero */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
        {backdropUrl ? (
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 -mt-32 md:-mt-48 relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Poster */}
        <div className="flex-shrink-0 mx-auto md:mx-0 w-48 md:w-72 shadow-2xl rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
          {media.poster_path ? (
            <img src={`${imgBaseUrl}${media.poster_path}`} alt={title} className="w-full h-auto block" />
          ) : (
            <div className="w-full aspect-[2/3] flex items-center justify-center text-gray-500">No Image</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{title} <span className="text-gray-400 font-normal text-2xl md:text-4xl">({year})</span></h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-300 mb-6">
            {media.vote_average > 0 && (
              <span className="flex items-center text-yellow-500 font-bold bg-gray-800 px-2 py-1 rounded">
                <Star className="w-4 h-4 mr-1 fill-current" /> {media.vote_average.toFixed(1)}
              </span>
            )}
            {runtime && <span>{runtime}</span>}
            <span className="hidden md:inline">&bull;</span>
            <span>{media.genres?.map(g => g.name).join(', ')}</span>
          </div>

          <div className="mb-8 flex justify-center md:justify-start space-x-4">
            <button 
              onClick={handleWatchlistToggle}
              className={`flex items-center px-6 py-3 rounded-full font-bold transition shadow-lg ${
                isSaved 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSaved ? (
                <><Check className="w-5 h-5 mr-2" /> In Watchlist</>
              ) : (
                <><Plus className="w-5 h-5 mr-2" /> Add to Watchlist</>
              )}
            </button>
            {media.videos?.results?.length > 0 && (
              <a 
                href={`https://www.youtube.com/watch?v=${media.videos.results[0].key}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center px-6 py-3 rounded-full font-bold bg-white text-gray-900 hover:bg-gray-200 transition shadow-lg"
              >
                <PlayCircle className="w-5 h-5 mr-2" /> Trailer
              </a>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl text-sm md:text-base">
              {media.overview || 'No overview available.'}
            </p>
          </div>

          {/* Cast */}
          {media.credits?.cast?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 border-l-4 border-blue-500 pl-3">Top Cast</h3>
              <div className="flex overflow-x-auto pb-4 space-x-4 hide-scrollbar">
                {media.credits.cast.slice(0, 8).map(actor => (
                  <div key={actor.cast_id} className="flex-shrink-0 w-24 md:w-32 text-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-2 bg-gray-800 mx-auto">
                      {actor.profile_path ? (
                         <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                    </div>
                    <p className="text-white text-xs md:text-sm font-semibold truncate">{actor.name}</p>
                    <p className="text-gray-500 text-xs truncate">{actor.character}</p>
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
