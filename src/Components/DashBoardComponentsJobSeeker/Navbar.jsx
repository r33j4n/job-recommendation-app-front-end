import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsername();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await axios.get('http://localhost:8081/jobseeker/get/1');
      setUsername(response.data.userName);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const handleDeleteAccount = () => {
    // Implement delete account logic here
    console.log('Deleting account...');
  };

  return (
    <nav className="navbar">
      <div className="navbar-user" ref={dropdownRef}>
        <button className="username-button" onClick={toggleDropdown}>
          {username} ▼
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;