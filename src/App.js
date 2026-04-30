import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-themeBase text-themeAccent font-sans selection:bg-themeGlow/30 selection:text-themeBase">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/tv-shows" element={<TvShows />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<Detail />} />
                <Route path="/tv-show/:id" element={<Detail />} />
                
                {/* Protected Route */}
                <Route 
                  path="/watchlist" 
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;
