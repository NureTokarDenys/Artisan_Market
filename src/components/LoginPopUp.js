import { useState, useEffect } from 'react';
import { FaX } from "react-icons/fa6";
import { usePopup } from '../hooks/usePopup';
import { useAuth } from '../hooks/useAuth';
import PopUpInput from './PopUpInput';
import './LoginPopUp.css';
import axios from 'axios';

const LoginPopUp = () => {
  const { closePopup, switchPopup, handleLoginSuccess } = usePopup();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const { email, password } = formData;

    if (!email || !password) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { userData, token } = response.data;

      login(userData, token);
      
      handleLoginSuccess();

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(null);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-backdrop" onClick={closePopup} />
      <div className="popup-container">
        <button className="close-button" onClick={closePopup}>
          <FaX size={24} />
        </button>

        <div className="form-section">
          <h2 className="form-title">Sign in</h2>
          
          <form onSubmit={handleSubmit}>
            <PopUpInput
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange('email')}
            />
            
            <PopUpInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
            />
            
            {error && (
              <div className="error-message" style={{
                color: 'red',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="login-text">
            Don't have an account?{' '} 
            <span className="login-link" onClick={switchPopup}>Register</span>
          </p>
        </div>

        <div className="image-section">
          <div className="image-content">
            <h3 className="image-title">Join Artisan Market</h3>
            <p className="image-description">Your marketplace for authentic handcrafted items</p>
          </div>
          <img
            src="/api/placeholder/800/600"
            alt="Artisan products"
            className="image"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;