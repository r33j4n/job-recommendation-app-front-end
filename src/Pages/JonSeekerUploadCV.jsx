import React from 'react';
import ResumeUpload from '../Components/DashBoardComponentsJobSeeker/UploadCV';
import SidebarComponent from '../Components/DashBoardComponentsJobSeeker/SideBar';
const UploadCVPage = () => {
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
            <ResumeUpload/>
            {/* Add main content here */}
          </div>
        </div>
      );
}
 
export default UploadCVPage;