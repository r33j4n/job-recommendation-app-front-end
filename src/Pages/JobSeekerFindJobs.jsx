import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
import FindJob from "../Components/DashBoardComponentsJobSeeker/FindJobs.jsx";
const JobSeekerFindJobs = () => {
    return (
        <div className="layout">
          <div className="sidebar">
            <h2>Quick Access</h2>
            <SidebarComponent/>
            {/* Add sidebar content here */}
          </div>
          <div className="content">
            <h2>Find Jobs Section</h2>
            <FindJob/>
            {/* Add main content here */}
          </div>
        </div>
      );
};

export default JobSeekerFindJobs;
