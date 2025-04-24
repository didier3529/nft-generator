import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = ({ backendUrl }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [preview, setPreview] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Prepare form data
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(backendUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      });

      setUploadStatus(`Upload successful! File ID: ${response.data.fileId}`);
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.response?.data?.message);
    }
  }, [backendUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'] },
    multiple: false
  });

  return (
    <div>
      <div {...getRootProps()} style={{
        border: '2px dashed #666',
        borderRadius: '8px',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: isDragActive ? '#f8f9fa' : 'white',
        cursor: 'pointer'
      }}>
        <input {...getInputProps()} />
        <p>{isDragActive ? 'Drop the PNG here...' : 'Drag & drop PNG, or click to select'}</p>
      </div>

      {preview && (
        <div style={{ marginTop: '1rem' }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '200px', borderRadius: '8px' }}
          />
        </div>
      )}

      {uploadProgress > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <progress value={uploadProgress} max="100" />
          <span style={{ marginLeft: '1rem' }}>{uploadProgress}%</span>
        </div>
      )}

      {uploadStatus && (
        <div style={{ marginTop: '1rem', color: uploadStatus.includes('failed') ? 'red' : 'green' }}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 