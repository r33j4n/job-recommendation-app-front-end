import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
import AllJobs from "../Components/DashBoardComponentsJobSeeker/AllJobs.jsx";
const JobSeekerAllJobs = () => {
    return (
        <div className="layout">
          <div className="sidebar">
            <h2>Quick Access</h2>
            <SidebarComponent/>
            {/* Add sidebar content here */}
          </div>
          <div className="content">
            <h2>All Jobs Section</h2>
            <AllJobs/>
            {/* Add main content here */}
          </div>
        </div>
      );
};

export default JobSeekerAllJobs;
