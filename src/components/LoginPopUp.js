import PopUpInput from './PopUpInput';
import PopUpSelect from './PopUpSelect';
import { useState, useEffect } from 'react';
import { FaX } from "react-icons/fa6";
import { usePopup, POPUP_TYPES } from './PopUpProvider';
import './LoginPopUp.css';

const LoginPopUp = ({ onClose, switchPopup }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="popup-overlay">
      <div className="popup-backdrop" onClick={onClose} />
      
      <div className="popup-container">
        <button className="close-button" onClick={onClose}>
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
            
            <button type="submit" className="submit-button">
              Login
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