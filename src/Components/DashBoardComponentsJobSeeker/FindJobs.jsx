import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FindJobs.css";

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
      const response = await axios.get("http://localhost:8081/application/all");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchSkillsAndJobs = async () => {
    try {
      const getSkillsResponse = await axios.get(
        `http://localhost:8081/jobseeker/getSkills/${roleid}`
      );
      const fetchedSkills = getSkillsResponse.data;
      setSkills(fetchedSkills);

      const requestData = {
        question: fetchedSkills.skills
      };

      const [lowResponse, highResponse] = await Promise.all([
        axios.post("http://127.0.0.1:5000/chat", requestData),
        axios.post("http://127.0.0.1:5000/chat_high", requestData),
      ]);

      const parseJobIds = (resultString) =>
        resultString
          .replace(/\(|\)|\[|\]/g, "")
          .split(",")
          .map(Number);

      const lowJobIds = parseJobIds(lowResponse.data.result);
      const highJobIds = parseJobIds(highResponse.data.result);

      fetchJobs(lowJobIds, setLowChanceJobs);
      fetchJobs(highJobIds, setHighChanceJobs);

      setShowResults(true);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching Skills and Jobs:", err);
    }
  };

  const handleApplicationSubmit = () => {
    fetchApplications();
  };

  return (
    <div className="find-job-container">
      <div className="button-container">
        <button className="find-button" onClick={fetchSkillsAndJobs}>
          Find Jobs
        </button>
      </div>
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