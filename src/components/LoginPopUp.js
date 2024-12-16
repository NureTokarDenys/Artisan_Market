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
    /* turned off for better testing
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    */
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
      }, {
        withCredentials: true
      });

      const { userId, accessToken, role } = response.data;
      console.log(role)
      login(userId, accessToken, role);
      
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
              type="text"
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

              
            <p className="forget-text">
              <span className="forget-link" onClick={() => {}}>Forgot password?</span>
            </p>
            
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
            src="https://artisan-market.s3.eu-central-1.amazonaws.com/c4ee69d71d3d6fb0625a3a80898f9719.jpg"
            alt="Artisan products"
            className="image"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPopUp;