import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * ProtectedRoute guards children behind authentication.
 *
 * If the user is not authenticated, they are redirected to /login with
 * the current location stored in `state.from` so Login can redirect back
 * after a successful sign-in.
 *
 * @param {Object}        props
 * @param {React.ReactNode} props.children - The content to protect.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the attempted location so Login can redirect back afterwards
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
