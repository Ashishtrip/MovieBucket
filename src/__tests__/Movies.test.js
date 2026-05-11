/**
 * @file Movies.test.js
 * Integration tests for the Movies page (API interaction, pagination, edge cases).
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Movies from '../pages/Movies';

// Mock the API module
jest.mock('../services/tmdbApi', () => ({
  getPopular: jest.fn(),
}));

import { getPopular } from '../services/tmdbApi';

/** Build a minimal TMDB popular-movies API response. */
const makeMockData = (page = 1, count = 3) => ({
  page,
  total_pages: 10,
  total_results: 200,
  results: Array.from({ length: count }, (_, i) => ({
    id: page * 100 + i,
    title: `Movie ${page}-${i}`,
    release_date: '2023-01-01',
    vote_average: 7.5,
    poster_path: null,
    media_type: 'movie',
  })),
});

const renderMovies = () =>
  render(
    <MemoryRouter>
      <Movies />
    </MemoryRouter>
  );

describe('Movies page', () => {
  afterEach(() => jest.clearAllMocks());

  it('shows a loading spinner initially', () => {
    getPopular.mockReturnValue(new Promise(() => {})); // never resolves
    renderMovies();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders a list of movies after data loads', async () => {
    getPopular.mockResolvedValueOnce(makeMockData(1));
    renderMovies();
    await waitFor(() =>
      expect(screen.getByText('Movie 1-0')).toBeInTheDocument()
    );
  });

  it('shows an error message when the API fails', async () => {
    getPopular.mockRejectedValueOnce(new Error('Network Error'));
    renderMovies();
    await waitFor(() =>
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    );
  });

  it('shows empty state when API returns no results', async () => {
    getPopular.mockResolvedValueOnce({
      page: 1,
      total_pages: 1,
      results: [],
    });
    renderMovies();
    await waitFor(() =>
      expect(screen.getByText(/no movies found/i)).toBeInTheDocument()
    );
  });

  it('renders pagination controls when data has multiple pages', async () => {
    getPopular.mockResolvedValueOnce(makeMockData(1));
    renderMovies();
    await waitFor(() =>
      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
    );
  });

  it('fetches page 2 when the Next button is clicked', async () => {
    getPopular
      .mockResolvedValueOnce(makeMockData(1))
      .mockResolvedValueOnce(makeMockData(2));

    renderMovies();
    await waitFor(() => screen.getByText('Movie 1-0'));

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));

    await waitFor(() =>
      expect(getPopular).toHaveBeenLastCalledWith('movie', 2)
    );
  });

  it('handles API response with missing results array gracefully', async () => {
    getPopular.mockResolvedValueOnce({ page: 1, total_pages: 1 }); // no `results`
    renderMovies();
    await waitFor(() =>
      expect(screen.getByText(/no movies found/i)).toBeInTheDocument()
    );
  });
});
