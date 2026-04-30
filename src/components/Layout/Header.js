import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film } from 'lucide-react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 bg-themeBase/90 backdrop-blur-lg border-b border-themeAccent/20 shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-themeGlow hover:text-themeGlow hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition">
            <Film className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-themeAccent hidden sm:block">MovieTracker</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-themeAccent hover:text-themeAccent transition font-medium text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-xs ml-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies, tv shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-themeBase text-sm text-themeAccent rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-themeGlow focus:bg-themeBase transition"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-themeAccent" />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-themeAccent hover:text-themeAccent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-themeBase border-b border-themeAccent/20 px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-themeBase text-themeAccent rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-themeGlow"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-themeAccent" />
          </form>
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-themeAccent hover:text-themeAccent py-2 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
