import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Document, Page, pdfjs } from 'react-pdf';
import './UploadCV.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [updating, setUpdating] = useState(false);
  const roleid = localStorage.getItem('roleId');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileType = selectedFile.type;
    if (fileType === "application/pdf" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (fileType === "application/pdf") {
        setPdfUrl(URL.createObjectURL(selectedFile));
      } else {
        setPdfUrl(null);
      }
    } else {
      toast.error('Please select a PDF or DOCX file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    if (!roleid) {
      toast.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userID', roleid);

    setUploading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:5000/upload-cv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        toast.success(response.data.db_message || 'Resume uploaded successfully!');
      } else {
        throw new Error(response.data.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.message || 'Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setFileName('');
    setPdfUrl(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleUpdateData = async () => {
    if (!roleid) {
      toast.error('User not logged in');
      return;
    }

    setUpdating(true);
    try {
      // Call Flask API to get the data
      const flaskResponse = await axios.post('http://127.0.0.1:5000/query-cv', { userID: roleid });
      
      if (flaskResponse.status === 200) {
        const { experience, skills, education } = flaskResponse.data.response;

        // Transform data to match Spring Boot requirements
        const springBootData = {
          education: education.length > 0 ? education[0].Degree : '',
          experience: experience.Details.map(detail => `${detail.Role ? detail.Role : ''} ${detail.CompanyName ? `at ${detail.CompanyName}` : ''} ${detail.Duration ? `(${detail.Duration})` : ''}`).join(', '),
          skills: skills.join(', ')
        };
        console.log('Spring Boot data:', springBootData);

        // Call Spring Boot API to update the data
        const springBootResponse = await axios.put(`http://127.0.0.1:8081/jobseeker/update_skills/${roleid}`, springBootData);

        if (springBootResponse.status === 200) {
          toast.success('Profile updated successfully!');
        } else {
          throw new Error('Failed to update profile in Spring Boot');
        }
      } else {
        throw new Error('Failed to get data from Flask API');
      }
    } catch (error) {
      console.error('Error updating data:', error);
      toast.error(error.message || 'Failed to update data. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="resume-upload">
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resume">Select Resume (PDF or DOCX)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="resume"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
            <span className="file-name">{fileName || 'No file chosen'}</span>
          </div>
        </div>
        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button type="button" className="update-btn" onClick={handleUpdateData} disabled={updating}>
            {updating ? 'Updating...' : 'Update Data'}
          </button>
        </div>
      </form>

      {pdfUrl && (
        <div className="pdf-viewer">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <div className="pdf-controls">
            <button 
              onClick={() => setPageNumber(pageNumber - 1)} 
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <button 
              onClick={() => setPageNumber(pageNumber + 1)} 
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;