import React, { createContext, useContext, useState } from 'react';
import RegisterPopUp from './RegisterPopUp';
import LoginPopUp from './LoginPopUp';

export const POPUP_TYPES = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
};

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (type) => {
    setActivePopup(type);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const switchPopup = () => {
    setActivePopup((prevPopup) =>
      prevPopup === POPUP_TYPES.REGISTER
        ? POPUP_TYPES.LOGIN
        : POPUP_TYPES.REGISTER
    );
  };

  return (
    <PopupContext.Provider
      value={{
        activePopup,
        openPopup,
        closePopup,
        switchPopup,
      }}
    >
      {children}
      {activePopup === POPUP_TYPES.REGISTER && (
        <RegisterPopUp onClose={closePopup} switchPopup={switchPopup} />
      )}
      {activePopup === POPUP_TYPES.LOGIN && (
        <LoginPopUp onClose={closePopup} switchPopup={switchPopup} />
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
