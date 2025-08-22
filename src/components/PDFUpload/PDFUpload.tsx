import React, { useCallback, useState } from 'react';
import './PDFUpload.css';

interface PDFUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const PDFUpload: React.FC<PDFUploadProps> = ({ onUpload, isLoading = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      alert('Please drop PDF files only');
      return;
    }

    for (const file of pdfFiles) {
      try {
        setUploadProgress(0);
        await onUpload(file);
        setUploadProgress(100);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      alert('Please select PDF files only');
      return;
    }

    for (const file of pdfFiles) {
      try {
        setUploadProgress(0);
        await onUpload(file);
        setUploadProgress(100);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    // Reset input
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className="pdf-upload">
      <div
        className={`pdf-upload__drop-zone ${isDragOver ? 'pdf-upload__drop-zone--active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="pdf-upload__content">
          <div className="pdf-upload__icon">📄</div>
          <h3 className="pdf-upload__title">Upload PDF Files</h3>
          <p className="pdf-upload__description">
            Drag and drop PDF files here, or click to browse
          </p>
          
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="pdf-upload__input"
            disabled={isLoading}
          />
          
          <button 
            className="pdf-upload__button"
            onClick={() => document.querySelector('.pdf-upload__input')?.click()}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Choose Files'}
          </button>

          {isLoading && (
            <div className="pdf-upload__progress">
              <div 
                className="pdf-upload__progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
