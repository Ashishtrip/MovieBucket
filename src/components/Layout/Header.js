import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Header – sticky top navigation with desktop nav links, search bar,
 * and a responsive mobile menu.
 *
 * Accessibility:
 * - All nav landmarks use <nav> with aria-label.
 * - Search input and button are labelled.
 * - Mobile menu toggle exposes aria-expanded / aria-controls.
 * - Active nav link is flagged with aria-current="page".
 */
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Watchlist', path: '/watchlist' },
  ];

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded px-1 py-0.5 ${
      isActive
        ? 'text-themeGlow underline underline-offset-4'
        : 'text-themeAccent hover:text-themeGlow'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-themeBase/90 backdrop-blur-lg border-b border-themeAccent/20 shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            aria-label="MovieTracker home"
            className="flex items-center space-x-2 text-themeGlow hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded"
          >
            <Film className="w-8 h-8" aria-hidden="true" />
            <span className="text-xl font-bold tracking-tight text-themeAccent hidden sm:block">
              MovieTracker
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className={navLinkClass}
                aria-label={link.name}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xs ml-8">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Search movies and TV shows"
              className="relative"
            >
              <label htmlFor="desktop-search" className="sr-only">
                Search movies and TV shows
              </label>
              <input
                id="desktop-search"
                type="search"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-themeBase text-sm text-themeAccent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-themeGlow transition"
                aria-label="Search query"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute left-3 top-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-1 focus-visible:ring-themeGlow rounded-full"
              >
                <Search className="w-4 h-4 text-themeAccent" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-themeAccent hover:text-themeGlow focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded p-1"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-themeBase border-b border-themeAccent/20 px-4 py-4 space-y-4"
        >
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Search movies and TV shows"
            className="relative"
          >
            <label htmlFor="mobile-search" className="sr-only">
              Search movies and TV shows
            </label>
            <input
              id="mobile-search"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-themeBase text-themeAccent rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-themeGlow"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 focus:outline-none"
            >
              <Search className="w-4 h-4 text-themeAccent" aria-hidden="true" />
            </button>
          </form>

          <nav aria-label="Mobile navigation" className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded px-1 ${
                    isActive
                      ? 'text-themeGlow underline underline-offset-4'
                      : 'text-themeAccent hover:text-themeGlow'
                  }`
                }
                aria-label={link.name}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Auth hint in mobile menu */}
          {!isAuthenticated && (
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm text-themeGlow font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow rounded px-1 py-2"
            >
              Sign In →
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
