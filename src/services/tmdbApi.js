import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrending = async (type = 'all', timeWindow = 'day') => {
  const response = await tmdbApi.get(`/trending/${type}/${timeWindow}`);
  return response.data;
};

export const searchMedia = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/multi', {
    params: {
      query,
      page,
      include_adult: false,
    },
  });
  return response.data;
};

export const getPopular = async (type = 'movie', page = 1) => {
  const response = await tmdbApi.get(`/${type}/popular`, {
    params: {
      page,
    },
  });
  return response.data;
};

export const getDetails = async (type, id) => {
  const response = await tmdbApi.get(`/${type}/${id}`, {
    params: {
      append_to_response: 'credits,videos',
    },
  });
  return response.data;
};

export default tmdbApi;
