/**
 * @file AuthContext.test.js
 * Unit tests for AuthContext login / logout with localStorage persistence.
 */
import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const Consumer = () => {
  const { isAuthenticated, login, logout } = useContext(AuthContext);
  return (
    <div>
      <p data-testid="auth">{String(isAuthenticated)}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const setup = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('starts as unauthenticated', () => {
    setup();
    expect(screen.getByTestId('auth').textContent).toBe('false');
  });

  it('sets isAuthenticated to true on login', async () => {
    setup();
    await userEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('auth').textContent).toBe('true');
  });

  it('sets isAuthenticated to false on logout', async () => {
    setup();
    await userEvent.click(screen.getByText('Login'));
    await userEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth').textContent).toBe('false');
  });

  it('persists auth state to localStorage after login', async () => {
    setup();
    await userEvent.click(screen.getByText('Login'));
    expect(localStorage.getItem('netfilm_auth')).toBe('true');
  });

  it('removes auth key from localStorage after logout', async () => {
    setup();
    await userEvent.click(screen.getByText('Login'));
    await userEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('netfilm_auth')).toBeNull();
  });

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem('netfilm_auth', 'true');
    setup();
    expect(screen.getByTestId('auth').textContent).toBe('true');
  });

  it('handles corrupted localStorage value gracefully', () => {
    localStorage.setItem('netfilm_auth', 'NOT_VALID_JSON{{');
    expect(() => setup()).not.toThrow();
    // Falls back to false
    expect(screen.getByTestId('auth').textContent).toBe('false');
  });
});
