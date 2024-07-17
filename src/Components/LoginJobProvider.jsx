// LoginComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoginComponent.css';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../Resources/Images/LoginImage.png';
import { toast, ToastContainer } from 'react-toastify';

const LoginJobProvider = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/login', {
        userName,
        password
      });

      if (response.data.loginSuccess) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('userName', payload.userName);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('loginSuccess', response.data.loginSuccess);
        localStorage.setItem('roleId', payload.jobProviderId);

        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        navigate('/profiledetails/jobprovider');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleForgotPassword = async () => {
    if (!userName) {
      setError('Please enter your username before requesting a password reset.');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/forgotPassword', {
        userName: userName,
        emailAddress: null
      });

      if (response.data.success) {
        setError('Failed to process forgot password request. Please try again.');
        setSuccessMessage('');
        
      } else {
        setSuccessMessage('Password reset link sent to your email');
        setError('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccessMessage('');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-image">
        <img src={LoginImage} alt="Login illustration" />
      </div>
      <div className="login-form">
        <h2>Welcome Back..!</h2>
        <h3 className="tagline">Unlock Hidden Opportunities: AI Finds Jobs for You.</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter User Name Here"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password Here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            {/* <p className="forgot-password" onClick={handleForgotPassword}>Forgot Password</p> */}
            <button type="button" className="forgot-password1" onClick={handleForgotPassword}>Forgot Password</button>
          </div>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="create-account">
          <a href="/signup/jobSeeker">Create New Account</a>
        </div>
      </div>
    </div>
  );
};

export default LoginJobProvider;