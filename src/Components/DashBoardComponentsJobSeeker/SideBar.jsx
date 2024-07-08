// SidebarComponent.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaTachometerAlt, FaBriefcase, FaClipboardList, FaSearch, FaUser, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';

const SidebarComponent = () => {
  return (
    <div className="sidebar">
      <NavLink to="/home" className="sidebar-item" activeClassName="active">
        <FaHome className="sidebar-icon" />
        Home
      </NavLink>
      <NavLink to="/dashboard/jobseeker" className="sidebar-item" activeClassName="active">
        <FaTachometerAlt className="sidebar-icon" />
        Dashboard
      </NavLink>
      <NavLink to="/alljobs/jobseeker" className="sidebar-item" activeClassName="active">
        <FaBriefcase className="sidebar-icon" />
        All Jobs
      </NavLink>
      <NavLink to="/appliedjobs/jobseeker" className="sidebar-item" activeClassName="active">
        <FaClipboardList className="sidebar-icon" />
        Applied Jobs
      </NavLink>
      <NavLink to="/findjobs/jobseeker" className="sidebar-item" activeClassName="active">
        <FaSearch className="sidebar-icon" />
        Find Jobs
      </NavLink>
      <NavLink to="/profiledetails/jobseeker" className="sidebar-item" activeClassName="active">
        <FaUser className="sidebar-icon" />
        Profile Details
      </NavLink>
      <NavLink to="/delete-account" className="sidebar-item" activeClassName="active">
        <FaTrashAlt className="sidebar-icon" />
        Delete Account
      </NavLink>
      <NavLink to="/logout" className="sidebar-item" activeClassName="active">
        <FaSignOutAlt className="sidebar-icon" />
        Logout
      </NavLink>
    </div>
  );
};

export default SidebarComponent;