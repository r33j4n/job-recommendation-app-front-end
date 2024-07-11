import React from "react";
import SidebarComponent from "../Components/DashBoardComponentsJobSeeker/SideBar.jsx";
import "./JobSeekerDashboard.css";
import ChatInterface from "../Components/DashBoardComponentsJobSeeker/Chat.jsx";
const ChatPageJobSeeker = () => {
  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Quick Chat</h2>
        <SidebarComponent />
        {/* Add sidebar content here */}
      </div>
      <div className="content">
        <h2>AI Chat</h2>
        <ChatInterface/>
        {/* Add main content here */}
      </div>
    </div>
  );
};

export default ChatPageJobSeeker;
