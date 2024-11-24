import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, userId: null, token: null });
  const navigate = useNavigate();

  const login = (userId, accessToken) => {
    setAuth({
      isAuthenticated: true,
      userId: userId,
      accessToken,
    });
  };

  const logout = async () => {
    navigate("/products", { replace: true });
    try {
      const response = await axiosPrivate.post("/api/auth/logout");
      setAuth({ isAuthenticated: false, userId: null, token: null });
    }catch(err){
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};