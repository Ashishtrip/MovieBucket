import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, LogIn } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/UI/Button';

/**
 * Login page – provides a mock authentication UI.
 * Redirects to the page the user originally requested (or /watchlist as default)
 * after a successful login.
 */
const Login = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Where to send the user after login (fallback to watchlist)
  const from = location.state?.from?.pathname || '/watchlist';

  // If the user is already logged in, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div
        role="main"
        className="bg-themeBase border border-themeAccent/20 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center"
      >
        {/* Branding */}
        <div className="flex items-center justify-center mb-6 gap-3">
          <Film className="w-10 h-10 text-themeGlow" aria-hidden="true" />
          <span className="text-2xl font-extrabold text-themeAccent tracking-tight">
            MovieTracker
          </span>
        </div>

        <h1 className="text-3xl font-bold text-themeAccent mb-2">
          Welcome Back
        </h1>
        <p className="text-themeAccent/70 mb-8 text-sm">
          Sign in to manage your personal watchlist.
        </p>

        {/* Mock credentials hint */}
        <div className="bg-themeAccent/10 border border-themeAccent/20 rounded-xl px-4 py-3 mb-8 text-left text-sm text-themeAccent/80">
          <p className="font-semibold text-themeAccent mb-1">Demo Account</p>
          <p>This is a mock login – no real credentials needed.</p>
          <p className="mt-1">
            Username: <span className="font-mono text-themeAccent">demo</span> &nbsp;|&nbsp; Password:{' '}
            <span className="font-mono text-themeAccent">demo</span>
          </p>
        </div>

        {/* Mock form fields (non-functional, for UI completeness) */}
        <div className="space-y-4 mb-6 text-left">
          <div>
            <label
              htmlFor="login-username"
              className="block text-sm font-medium text-themeAccent mb-1"
            >
              Username
            </label>
            <input
              id="login-username"
              type="text"
              defaultValue="demo"
              readOnly
              aria-readonly="true"
              className="w-full bg-themeBase border border-themeAccent/30 text-themeAccent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-themeGlow"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-themeAccent mb-1"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              defaultValue="demo"
              readOnly
              aria-readonly="true"
              className="w-full bg-themeBase border border-themeAccent/30 text-themeAccent rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-themeGlow"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleLogin}
          aria-label="Sign in with demo account"
          id="login-submit-btn"
        >
          <LogIn className="w-5 h-5 mr-2" aria-hidden="true" />
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default Login;
