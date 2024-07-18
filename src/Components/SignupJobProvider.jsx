// SignUpComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './SignupJobSeeker.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SignUpImage from "../Resources/Images/Personal site-amico.png"

const SignUpJobProviderComponent = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userName: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    setErrors({...errors, [name]: ''});

    if (name === 'email') {
      if (!validateEmail(value)) {
        setErrors({...errors, email: 'Please enter a valid email address'});
      }
    }

    if (name === 'password') {
      if (!validatePassword(value)) {
        setErrors({...errors, password: 'Password must contain at least 8 characters,atleast one uppercase letter, one lowercase letter, one number, and one special character'});
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters,atleast one uppercase letter, one lowercase letter, one number, and one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/jobprovider/create', {
        ...formData,
        registeredDate: new Date().toISOString().split('T')[0]
      });
      if(response.data.isDuplicated){
        console.log('User Not created:', response.data);
        toast.error('User Name Already Exists');
      }
      else{
        console.log('User created:', response.data);
        toast.success('Account created successfully!');
        setTimeout(() => {
          navigate('/login/jobProvider');
        }, 2000);
      }
    } catch (err) {
      setErrors({...errors, general: 'An error occurred. Please try again.'});
      console.error(err);
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-image">
        <img src={SignUpImage} alt="Login illustration" />
      </div>
      <div className="signup-form">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          
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
          {errors.password && <p className="error-message">{errors.password}</p>}
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          
          <button type="submit" className="signup-button">SIGN UP</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <p className="login-link">
          Already have an account? <a href="/login/jobSeeker">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpJobProviderComponent;