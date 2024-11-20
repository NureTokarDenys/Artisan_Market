// ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { usePopup, POPUP_TYPES } from './PopUpProvider';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { openPopup } = usePopup();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Store the current path before opening popup
      sessionStorage.setItem('intendedPath', location.pathname);
      openPopup(POPUP_TYPES.LOGIN);
    }
  }, [isAuthenticated, openPopup, location]);

  if (!isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ProtectedRoute;