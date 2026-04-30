import React, { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // We will just show a simple mock login prompt instead of redirecting completely,
    // or we can redirect to a dedicated mock login page.
    // For simplicity, let's render a mock login prompt right here if not authenticated.
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-themeBase p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-themeAccent mb-4">Authentication Required</h2>
          <p className="text-themeAccent mb-8">You must be logged in to view your Watchlist.</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return children;
};

const LoginButton = () => {
  const { login } = useContext(AuthContext);
  return (
    <button
      onClick={login}
      className="bg-themeAccent text-themeBase font-bold shadow-glow hover:bg-themeGlow transition duration-300 font-bold py-2 px-6 rounded-full transition w-full"
    >
      Mock Log In
    </button>
  );
}

export default ProtectedRoute;
