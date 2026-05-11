/**
 * @file App.test.js
 * Smoke test: verifies the App renders without crashing and shows the header.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock TMDB API calls so the app doesn't make real network requests
jest.mock('./services/tmdbApi', () => ({
  getTrending: jest.fn().mockResolvedValue({ results: [] }),
  getPopular: jest.fn().mockResolvedValue({ results: [], total_pages: 1 }),
  searchMedia: jest.fn().mockResolvedValue({ results: [], total_pages: 1 }),
  getDetails: jest.fn().mockResolvedValue(null),
}));

test('renders the MovieTracker header without crashing', async () => {
  render(<App />);
  // "MovieTracker" appears in both the header and footer – use getAllByText
  const instances = screen.getAllByText('MovieTracker');
  expect(instances.length).toBeGreaterThanOrEqual(1);
});

test('renders primary navigation links', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Movies' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'TV Shows' })).toBeInTheDocument();
});
