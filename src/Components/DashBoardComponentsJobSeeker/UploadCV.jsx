import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import './UploadCV.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [fileType, setFileType] = useState(null);
  const roleid = localStorage.getItem('roleId');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    handleFileSelection(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const handleFileSelection = (selectedFile) => {
    const type = selectedFile.type;
    if (type.startsWith('application/pdf') || 
        type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        type === 'application/msword' ||
        type.startsWith('image/')) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileUrl(URL.createObjectURL(selectedFile));
      setFileType(type);
    } else {
      toast.error('Please select a PDF, DOC, DOCX, or image file');
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
      const springResponse = await axios.post(`http://localhost:8081/jobseeker/upload-cv-img/${roleid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (springResponse.status === 200) {
        toast.success(springResponse.data.message || 'File uploaded to Spring Boot successfully!');
        
        const flaskResponse = await axios.post(`http://127.0.0.1:5000/upload-cv`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (flaskResponse.status === 200) {
          toast.success(flaskResponse.data.db_message || 'File uploaded to Flask successfully!');
        } else {
          throw new Error(flaskResponse.data.error || 'Failed to upload file to Flask');
        }

      } else {
        throw new Error(springResponse.data.error || 'Failed to upload file to Spring Boot');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setFileName('');
    setFileUrl(null);
    setFileType(null);
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

        const springBootData = {
          education: education.length > 0 ? education[0].Degree : '',
          experience: experience.Details.map(detail =>
            `${detail.Role ? detail.Role : ''} ${detail.CompanyName ? `at ${detail.CompanyName}` : ''}${detail.Duration ? ` (${detail.Duration})` : ''}`
          ).join(', '),
          skills: skills.join(', ')
        };
        console.log('Spring Boot data:', springBootData);

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
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            {
              isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag and drop your resume or image here, or click to select files</p>
            }
            {fileName && <p className="file-name">Selected file: {fileName}</p>}
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

      {fileUrl && (
        <div className="file-viewer">
          {fileType && fileType.startsWith('image/') ? (
            <img src={fileUrl} alt="Uploaded" className="uploaded-image" />
          ) : fileType === 'application/pdf' ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
          ) : (
            <p>Preview not available for this file type</p>
          )}
          {fileType === 'application/pdf' && (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
