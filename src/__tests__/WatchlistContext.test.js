/**
 * @file WatchlistContext.test.js
 * Unit tests for WatchlistContext add / remove / isInWatchlist logic.
 */
import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WatchlistContext, WatchlistProvider } from '../context/WatchlistContext';

// ── Helper: consumer component that exercises the context ────────────────────
const Consumer = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useContext(WatchlistContext);

  const item = { id: 42, title: 'Test Movie', media_type: 'movie' };

  return (
    <div>
      <p data-testid="count">{watchlist.length}</p>
      <p data-testid="in-list">{String(isInWatchlist(42))}</p>
      <button onClick={() => addToWatchlist(item)}>Add</button>
      <button onClick={() => removeFromWatchlist(42)}>Remove</button>
    </div>
  );
};

const setup = () =>
  render(
    <WatchlistProvider>
      <Consumer />
    </WatchlistProvider>
  );

// ── Tests ────────────────────────────────────────────────────────────────────
describe('WatchlistContext', () => {
  beforeEach(() => localStorage.clear());

  it('starts with an empty watchlist', () => {
    setup();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('adds an item to the watchlist', async () => {
    setup();
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('in-list').textContent).toBe('true');
  });

  it('does not duplicate items', async () => {
    setup();
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
  });

  it('removes an item from the watchlist', async () => {
    setup();
    await userEvent.click(screen.getByText('Add'));
    await userEvent.click(screen.getByText('Remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
    expect(screen.getByTestId('in-list').textContent).toBe('false');
  });

  it('persists watchlist to localStorage', async () => {
    setup();
    await userEvent.click(screen.getByText('Add'));
    const stored = JSON.parse(localStorage.getItem('watchlist'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(42);
  });

  it('loads watchlist from localStorage on mount', () => {
    localStorage.setItem(
      'watchlist',
      JSON.stringify([{ id: 42, title: 'Test Movie', media_type: 'movie' }])
    );
    setup();
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('in-list').textContent).toBe('true');
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('watchlist', 'NOT_VALID_JSON{{');
    // Should not throw; falls back to []
    expect(() => setup()).not.toThrow();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
