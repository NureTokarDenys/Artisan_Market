import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { POPUP_TYPES } from './PopUpProvider';
import { useAuth } from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import { Loader } from '../components/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { openPopup } = usePopup();
  const { auth, checkLoginStatus } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loader size="lg" color="red" text="Loading..." />;
  }

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkLoginStatus(); 
      } catch (error) {
        console.error('Error during authentication check:', error);
      } finally {
        setLoading(false); 
      }
    };

    verifyAuth();
  }, []);

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

  if (auth?.isAuthenticated && !allowedRoles.includes(auth?.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ currentRole: auth.role, requiredRoles: allowedRoles }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
