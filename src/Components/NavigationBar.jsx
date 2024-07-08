import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css';
import LogoImage from '../Resources/Images/logo.jpg';

const NavBarComponent = () => {
  const [loginStatus, setLoginStatus] = useState(localStorage.getItem('loginSuccess') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setLoginStatus(localStorage.getItem('loginSuccess') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    localStorage.setItem('loginSuccess', 'false');
    localStorage.removeItem('roleId')
    setLoginStatus(false);
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* <img src={LogoImage} alt="Logo" /> */}
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/aboutus">About Us</Link>
        </li>
        <li className="navbar-dropdown">
          <span>Dashboard</span>
          <div className="dropdown-content">
            <Link to="/dashboard/jobseeker">Jobseeker Dashboard</Link>
            <Link to="/dashboard/jobprovider">Job Provider Dashboard</Link>
          </div>
        </li>
        <li>
          {loginStatus ? (
            <span onClick={handleLogout} className="login-logout">Logout</span>
          ) : (
            // <Link to="/login" className="login-logout">Login</Link>
            <a href='#join' className='page-scroll'>Login </a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBarComponent;
