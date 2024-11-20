import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { POPUP_TYPES } from './PopUpProvider';
import { useAuth } from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';

const ProtectedRoute = ({ children }) => {
  const { openPopup } = usePopup();
  const { auth } = useAuth(); 
  const location = useLocation();

  useEffect(() => {
    if (!auth.isAuthenticated) {  
      const previousPath = location.state?.from || '/products';
      sessionStorage.setItem('intendedPath', location.pathname);
      sessionStorage.setItem('previousPath', previousPath);
      openPopup(POPUP_TYPES.LOGIN);
    }
  }, [auth.isAuthenticated, openPopup, location]);

  if (!auth.isAuthenticated) {  
    const previousPath = sessionStorage.getItem('previousPath') || '/products';
    return <Navigate to={previousPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
