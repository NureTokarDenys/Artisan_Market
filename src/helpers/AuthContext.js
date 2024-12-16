import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    userId: null,
    token: null,
    role: null,
  });
  const navigate = useNavigate();

  const login = (userId, accessToken, role) => {
    setAuth({
      isAuthenticated: true,
      userId,
      token: accessToken,
      role,
    });
  };

  const logout = async () => {
    navigate("/products", { replace: true });
    try {
      setAuth({ isAuthenticated: false, userId: null, token: null, role: null });
      const response = await axiosPrivate.post("/api/auth/logout");
    } catch (err) {
      console.error(err);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('/api/auth/status', {
        withCredentials: true,
      });

      if (response.data.authenticated) {
        const { userId, accessToken, role } = response.data;
        setAuth({
          isAuthenticated: true,
          userId,
          token: accessToken,
          role,
        });
      } else {
        setAuth({ isAuthenticated: false, userId: null, token: null, role: null });
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
