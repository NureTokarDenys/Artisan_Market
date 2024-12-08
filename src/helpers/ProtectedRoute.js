import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { POPUP_TYPES } from './PopUpProvider';
import useAuth from '../hooks/useAuth';
import usePopup from '../hooks/usePopup';
import { Loader } from '../components/Loader';

const ProtectedRoute = ({ children }) => {
  const { auth, checkLoginStatus } = useAuth();
  const { openPopup } = usePopup();
  const location = useLocation();

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const verifyAuth = async () => {
      await checkLoginStatus(); 
      setLoading(false); 
    };
    verifyAuth();
  }, []);

  if (loading) {
    return <Loader size="lg" color="blue" text="Checking authentication..." />;
  }

  if (!auth.isAuthenticated) {
    // Redirect to login popup or default route if unauthenticated
    sessionStorage.setItem('intendedPath', location.pathname); // Save the intended path
    openPopup(POPUP_TYPES.LOGIN);
    return <Navigate to="/products" replace />;
  }

  return children; // Render the protected content if authenticated
};

export default ProtectedRoute;
