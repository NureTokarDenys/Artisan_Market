import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios'
import axios from '../api/axios'

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

  const checkLoginStatus = async () => {
      try {
          const response = await axios.get('/api/auth/status', {
              withCredentials: true,
          });

          if (response.data.authenticated) {
              setAuth({ isAuthenticated: true, userId: response.data.userId, token: response.data.accessToken });
          } else {
            setAuth({ isAuthenticated: false, userId: "hello dolbaeb", token: null });
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