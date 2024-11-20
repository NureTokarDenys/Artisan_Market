import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RegisterPopUp from '../components/RegisterPopUp';
import LoginPopUp from '../components/LoginPopUp';

export const POPUP_TYPES = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
};

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openPopup = (type) => {
    if (!sessionStorage.getItem('previousPath')) {
      sessionStorage.setItem('previousPath', location.pathname);
    }
    setActivePopup(type);
  };

  const closePopup = () => {
    setActivePopup(null);
    const previousPath = sessionStorage.getItem('previousPath');
    navigate(previousPath, { replace: true });
    sessionStorage.removeItem('intendedPath');
    sessionStorage.removeItem('previousPath');
  };

  const switchPopup = () => {
    setActivePopup((prevPopup) =>
      prevPopup === POPUP_TYPES.REGISTER
        ? POPUP_TYPES.LOGIN
        : POPUP_TYPES.REGISTER
    );
  };

  const handleLoginSuccess = () => {
    const intendedPath = sessionStorage.getItem('intendedPath');
    closePopup();
    
    if (intendedPath) {
      navigate(intendedPath, { replace: true });
      sessionStorage.removeItem('intendedPath');
      sessionStorage.removeItem('previousPath');
    }
  };

  const handleRegistrationSuccess = () => {
    closePopup();
    const currentPath = location.pathname;
    navigate('/profile', { 
      state: { from: currentPath }
    });
  };

  return (
    <PopupContext.Provider
      value={{
        activePopup,
        openPopup,
        closePopup,
        switchPopup,
        handleLoginSuccess,
        handleRegistrationSuccess,
      }}
    >
      {children}
      {activePopup === POPUP_TYPES.REGISTER && (
        <RegisterPopUp />
      )}
      {activePopup === POPUP_TYPES.LOGIN && (
        <LoginPopUp />
      )}
    </PopupContext.Provider>
  );
};