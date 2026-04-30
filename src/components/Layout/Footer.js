import React from 'react';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-themeBase border-t border-themeAccent/20 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-2 text-themeAccent">
          <Film className="w-6 h-6" />
          <span className="text-lg font-bold">MovieTracker</span>
        </div>
        <p className="text-themeAccent text-sm">
          &copy; {new Date().getFullYear()} MovieTracker. All rights reserved. Data provided by TMDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
