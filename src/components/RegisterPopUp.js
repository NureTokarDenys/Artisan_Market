import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../helpers/PopUpProvider';
import { useAuth } from '../helpers/AuthContext';
import { FaX } from "react-icons/fa6";
import PopUpInput from './PopUpInput';
import PopUpSelect from './PopUpSelect';
import './RegisterPopUp.css';

const RegisterPopup = () => {
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

  const { closePopup, switchPopup } = usePopup();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your registration API call here
      // const response = await registerUser(formData);
      
      // Close register popup
      closePopup();
      
      // Navigate to profile (will trigger login popup)
      navigate('/profile');
    } catch (error) {
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