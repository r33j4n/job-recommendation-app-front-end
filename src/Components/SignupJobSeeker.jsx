// SignUpComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignupJobSeeker.css';
import SignUpImage from "../Resources/Images/Personal site-amico.png"

const SignUpJobSeekerComponent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/jobseeker/create', {
        ...formData,
        registeredDate: new Date().toISOString().split('T')[0]
      });
      console.log('User created:', response.data);
      // Handle successful signup (e.g., redirect to login page)
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
      <img src={SignUpImage} alt="Login illustration" />
      </div>
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="login-link">
          Already have an account? <a href="/login/jobSeeker">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpJobSeekerComponent;