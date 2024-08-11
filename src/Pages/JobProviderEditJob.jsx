import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./JobProviderDashpoardPage.css";
import SidebarComponent from "../Components/DashBoardComponentJobProvider/SideBar.jsx";
// import PostedJobs from "../Components/DashBoardComponentJobProvider/PostedJobs.jsx";
// import EditJob from "../Components/DashBoardComponentJobProvider/EditJob.jsx";

const JobProviderEditJobs = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    jobTitle: "",
    jobDescription: "",
    jobLocation: "",
    jobExperience: "",
    qualifiedEducation: "",
    jobSkills: "",
    isHired: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/job/getJobById/${jobId}`
        );
        setJob({
          ...response.data,
          isHired: response.data.isHired === true, // Ensure it's a boolean
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        setError("Failed to fetch job details");
      }
    };

    fetchJob();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob({
      ...job,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCancel = (e) => {
    navigate("/postedjobs/jobprovider");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(job).some((value) => value === "")) {
      setError("All fields are required");
      return;
    }
    try {
      const updatedJob = {
        ...job,
        isHired: job.isHired, // This will be true if checked, false if not
        jobProviderId: 1, // Assuming this is fixed or you get it from somewhere
      };
      await axios.put(`http://localhost:8081/job/update/${jobId}`, updatedJob);
      navigate("/postedjobs/jobprovider"); // Redirect to job listings page
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Failed to update job");
    }
  };
  return (
    <div>
      <div className="main-layout">
        <SidebarComponent />
        <div className="content1">
          {/* <div className="edit-job-container"> */}
          <h2>Edit Job</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={job.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobDescription">Job Description</label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={job.jobDescription}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobLocation">Location</label>
              <input
                type="text"
                id="jobLocation"
                name="jobLocation"
                value={job.jobLocation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobExperience">Experience</label>
              <input
                type="text"
                id="jobExperience"
                name="jobExperience"
                value={job.jobExperience}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobSkills">Skills</label>
              <input
                type="text"
                id="jobSkills"
                name="jobSkills"
                value={job.jobSkills}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="qualifiedEducation">Education</label>
              <input
                type="text"
                id="qualifiedEducation"
                name="qualifiedEducation"
                value={job.qualifiedEducation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="hiring-status-container">
              <label htmlFor="isHired" className="hiring-status-label">
                Hiring Status
                <input
                  type="checkbox"
                  id="isHired"
                  name="isHired"
                  checked={job.isHired}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default JobProviderEditJobs;
