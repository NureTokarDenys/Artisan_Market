import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterPopUp from '../components/RegisterPopUp';
import LoginPopUp from '../components/LoginPopUp';

export const POPUP_TYPES = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
};

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();

  const openPopup = (type) => {
    setActivePopup(type);
  };

  const closePopup = () => {
    setActivePopup(null);
    // Clear intended path when explicitly closing
    sessionStorage.removeItem('intendedPath');
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
      // Clear the stored path
      sessionStorage.removeItem('intendedPath');
      // Navigate to the intended path
      navigate(intendedPath, { replace: true });
    }
  };

  const handleRegistrationSuccess = () => {
    closePopup();
    // After registration, redirect to profile which will trigger login
    navigate('/profile');
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

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};