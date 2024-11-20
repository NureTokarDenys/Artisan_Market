import { useState, useEffect } from 'react';
import { FaX } from "react-icons/fa6";
import { usePopup } from '../hooks/usePopup';
import { useAuth } from '../hooks/useAuth';
import PopUpInput from './PopUpInput';
import PopUpSelect from './PopUpSelect';
import './RegisterPopUp.css';
import axios from 'axios';

const RegisterPopup = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState(null);

  const { closePopup, switchPopup, handleRegistrationSuccess } = usePopup();
  const { login } = useAuth();

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(null);
  };

  const validateForm = () => {
    const { email, password, confirmPassword, name, surname } = formData;
    
    if (!email || !password || !confirmPassword || !name || !surname) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords must match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 symbols');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);

    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
        role: formData.role
      });

      handleRegistrationSuccess();

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration failed:', error);
    }
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
          <h2 className="form-title">Sign up</h2>
          
          <form onSubmit={handleSubmit}>
            <PopUpSelect 
              value={formData.role}
              onChange={handleChange('role')}
            />
            
            <PopUpInput
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange('email')}
            />
            
            <PopUpInput
              label="Full name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange('name')}
            />
            
            <PopUpInput
              label="Surname"
              type="text"
              placeholder="Enter your surname"
              value={formData.surname}
              onChange={handleChange('surname')}
            />
            
            <PopUpInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
            />
            
            <PopUpInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
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

            <button type="submit" className="submit-button">
              Register
            </button>
          </form>

          <p className="login-text">
            Already have an account?{' '}
            <span className="login-link" onClick={switchPopup}>Log in</span>
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

export default RegisterPopup;