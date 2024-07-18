import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FindJobs.css";
import LinearProgress from '@mui/material/LinearProgress'; // Import this if you're using Material-UI

const JobCard = ({ job, applications, onApplicationSubmit, highChance }) => {
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const application = applications.find((app) => app.job.jobId === job.jobId);
    setIsApplied(application && application.applicationStatus);
  }, [applications, job.jobId]);

  const handleApply = async () => {
    try {
      const roleid = localStorage.getItem("roleId");
      const response = await axios.post(
        "http://localhost:8081/application/create",
        {
          applicationStatus: true,
          jobAppliedDate: new Date().toISOString().split("T")[0],
          jobSeekerId: roleid,
          jobId: job.jobId,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setIsApplied(true);
        toast.success("Application submitted successfully!");
        if (onApplicationSubmit) onApplicationSubmit();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className={`job-card ${highChance ? "high-chance" : "low-chance"}`}>
      <div className="job-header">
        <h2>{job.jobTitle}</h2>
        <span className="status1">Not Hired</span>
      </div>
      <p>{job.jobDescription}</p>
      <div className="job-details">
        <p>
          <strong>Experience:</strong> {job.jobExperience}
        </p>
        <p>
          <strong>Education:</strong> {job.qualifiedEducation}
        </p>
        <p>
          <strong>Location:</strong> {job.jobLocation}
        </p>
        <p>
          <strong>Posted on:</strong>{" "}
          {new Date(job.jobPostedDate).toLocaleDateString()}
        </p>
      </div>
      <div className="job-skills">
        {job.jobSkills.split(", ").map((skill) => (
          <span key={skill} className="skill">
            {skill}
          </span>
        ))}
      </div>
      <button
        className={`apply-button1 ${isApplied ? "applied" : ""}`}
        disabled={isApplied}
        onClick={handleApply}
      >
        {isApplied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
};

const FindJob = () => {
  const roleid = localStorage.getItem("roleId");
  const [highChanceJobs, setHighChanceJobs] = useState([]);
  const [lowChanceJobs, setLowChanceJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState({});
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [experience, setExperience] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchJobs = async (ids, setJobs) => {
    const fetchedJobs = await Promise.all(
      ids.map(async (id) => {
        try {
          const response = await axios.get(
            `http://localhost:8081/job/getJobById/${id}`
          );
          return response.data;
        } catch (error) {
          console.error(`Error fetching job with ID ${id}:`, error);
          return null;
        }
      })
    );
    setJobs(fetchedJobs.filter((job) => job !== null));
  };

  const fetchApplications = async () => {
    try {
      roleid = localStorage.getItem("roleId");
      console.log(roleid);
      const response = await axios.get(`http://localhost:8081/application/jobs/${roleid}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

 

  const fetchSkillsAndJobs = async () => {
    setIsLoading(true);
    setShowResults(false);
    try {
      toast.info("Fetching your skills and experience...");
      const getSkillsResponse = await axios.get(
        `http://localhost:8081/jobseeker/getSkills/${roleid}`
      );
      const getExperienceResponse = await axios.get(
        `http://localhost:8081/jobseeker/get/${roleid}`
      );
      const fetchedSkills = getSkillsResponse.data;
      const fetchedExperience = getExperienceResponse.data;
      setSkills(fetchedSkills);
      setExperience(fetchedExperience);

      toast.info("Analyzing job matches...");
      const requestData = {
        question: fetchedSkills.skills
      };
      const requestDataWithExperience = {
        question: fetchedSkills.skills,
        experience: fetchedExperience.experience
      };
      
      const [lowResponse, highResponse] = await Promise.all([
        axios.post("http://127.0.0.1:5000/chat", requestData),
        axios.post("http://127.0.0.1:5000/chat_high", requestDataWithExperience),
      ]);

      const parseJobIds = (resultString) =>
        resultString
          .replace(/\(|\)|\[|\]/g, "")
          .split(",")
          .map(Number);

      const lowJobIds = parseJobIds(lowResponse.data.result);
      const highJobIds = parseJobIds(highResponse.data.result);

      toast.info("Fetching job details...");
      await Promise.all([
        fetchJobs(lowJobIds, setLowChanceJobs),
        fetchJobs(highJobIds, setHighChanceJobs)
      ]);

      setShowResults(true);
      toast.success("Job search completed!");
    } catch (err) {
      setError(err.message);
      console.error("Error fetching Skills and Jobs:", err);
      toast.error("An error occurred while searching for jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationSubmit = () => {
    fetchApplications();
  };
  return (
    <div className="find-job-container">
    <div className="button-container">
      <button className="find-button" onClick={fetchSkillsAndJobs} disabled={isLoading}>
        {isLoading ? "Searching..." : "Find Jobs"}
      </button>
    </div>
    {isLoading && <LinearProgress />}
    {showResults && (
      <div className="job-results">
          <h2>High Chances</h2>
          {highChanceJobs.reduce((rows, job, index) => {
            if (index % 2 === 0) {
              rows.push(
                <div className="job-row" key={job.jobId}>
                  <JobCard
                    job={job}
                    applications={applications}
                    onApplicationSubmit={handleApplicationSubmit}
                    highChance={true}
                  />
                  {highChanceJobs[index + 1] && (
                    <JobCard
                      job={highChanceJobs[index + 1]}
                      applications={applications}
                      onApplicationSubmit={handleApplicationSubmit}
                      highChance={true}
                    />
                  )}
                </div>
              );
            }
            return rows;
          }, [])}
          <h2>Low Chances</h2>
          {lowChanceJobs.reduce((rows, job, index) => {
            if (index % 2 === 0) {
              rows.push(
                <div className="job-row" key={job.jobId}>
                  <JobCard
                    job={job}
                    applications={applications}
                    onApplicationSubmit={handleApplicationSubmit}
                    highChance={false}
                  />
                  {lowChanceJobs[index + 1] && (
                    <JobCard
                      job={lowChanceJobs[index + 1]}
                      applications={applications}
                      onApplicationSubmit={handleApplicationSubmit}
                      highChance={false}
                    />
                  )}
                </div>
              );
            }
            return rows;
          }, [])}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FindJob;