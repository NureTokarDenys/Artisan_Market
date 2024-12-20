import { useState, useEffect } from 'react';
import { FaX } from "react-icons/fa6";
import { usePopup } from '../hooks/usePopup';
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

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(null);
  };

  const validateForm = async () => {
    const { email, password, confirmPassword, name, surname, role } = formData;
    
    if(role == 'user'){
      setError('Please select role');
      return false;
    }

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

    const response = await axios.post("/api/auth/checkemail", { email: email });
    if(!response.data.availible){
      setError('Email already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);

    const isValid = await validateForm();
    if (!isValid) return;

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
                margin: '0',
                textAlign: 'center',
                fontSize: '15px'
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
            src="https://artisan-market.s3.eu-central-1.amazonaws.com/c4ee69d71d3d6fb0625a3a80898f9719.jpg"
            alt="Artisan products"
            className="image"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPopup;