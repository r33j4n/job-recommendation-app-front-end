import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
import ProfileDetails from "../Components/DashBoardComponentsJobSeeker/ProfileDetails.jsx";
import Navbar from "../Components/DashBoardComponentsJobSeeker/Navbar.jsx";
const JobSeekerProfileDetails = () => {
    return (
        <div className="layout">
          <div className="sidebar">
            <h2>Quick Access</h2>
            <SidebarComponent/>
            {/* Add sidebar content here */}
          </div>
          <div className="content">
            {/* <h2>Profile Details Section</h2> */}
            {/* <Navbar/> */}
            <ProfileDetails/>
            {/* Add main content here */}
          </div>
        </div>
      );
};

export default JobSeekerProfileDetails;
