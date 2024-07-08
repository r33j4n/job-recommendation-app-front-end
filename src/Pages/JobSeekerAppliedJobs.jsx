import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx"
import "./JobSeekerDashboard.css"
const JobSeekerAppliedJobs = () => {
    return (
        <div className="layout">
          <div className="sidebar">
            <h2>Quick Access</h2>
            <SidebarComponent/>
            {/* Add sidebar content here */}
          </div>
          <div className="content">
            <h2>Applied Jobs Section</h2>
            {/* Add main content here */}
          </div>
        </div>
      );
};

export default JobSeekerAppliedJobs;
