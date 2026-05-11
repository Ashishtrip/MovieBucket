/**
 * @file MovieCard.test.js
 * Unit tests for the MovieCard component.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../components/UI/MovieCard';

const renderCard = (media) =>
  render(
    <MemoryRouter>
      <MovieCard media={media} />
    </MemoryRouter>
  );

describe('MovieCard', () => {
  const movieMedia = {
    id: 1,
    title: 'Test Movie',
    release_date: '2023-06-15',
    vote_average: 8.2,
    poster_path: '/test.jpg',
    media_type: 'movie',
  };

  const tvMedia = {
    id: 2,
    name: 'Test Show',
    first_air_date: '2022-01-01',
    vote_average: 7.5,
    poster_path: null,
    media_type: 'tv',
  };

  it('renders null without crashing when media is undefined', () => {
    const { container } = render(<MemoryRouter><MovieCard /></MemoryRouter>);
    expect(container.firstChild).toBeNull();
  });

  it('renders the movie title and year', () => {
    renderCard(movieMedia);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('uses `name` field for TV shows', () => {
    renderCard(tvMedia);
    expect(screen.getByText('Test Show')).toBeInTheDocument();
  });

  it('links to the correct movie route', () => {
    renderCard(movieMedia);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('links to the correct TV show route', () => {
    renderCard(tvMedia);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tv-show/2');
  });

  it('shows rating badge when vote_average > 0', () => {
    renderCard(movieMedia);
    expect(screen.getByText('8.2')).toBeInTheDocument();
  });

  it('hides rating badge when vote_average is 0', () => {
    renderCard({ ...movieMedia, vote_average: 0 });
    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
  });

  it('shows "No Image" when poster_path is missing', () => {
    renderCard(tvMedia);
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('includes a descriptive aria-label on the link', () => {
    renderCard(movieMedia);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('Test Movie'));
    expect(link).toHaveAttribute('aria-label', expect.stringContaining('2023'));
  });

  it('renders a poster image with alt text when poster_path is present', () => {
    renderCard(movieMedia);
    const img = screen.getByAltText('Test Movie poster');
    expect(img).toBeInTheDocument();
  });
});
