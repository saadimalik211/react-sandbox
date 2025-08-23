import { useState, useEffect, useCallback } from 'react';
import { PDFFile, AssemblyRequest, JobStatus } from '../types';
import { pdfService, APIError } from '../services/api';

export const usePDFManagement = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [assembled, setAssembled] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load PDF files on component mount
  useEffect(() => {
    loadPDFFiles();
  }, []);

  // Poll for assembly status when job is active
  useEffect(() => {
    if (currentJobId && isAssembling) {
      const interval = setInterval(() => {
        checkAssemblyStatus(currentJobId);
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [currentJobId, isAssembling]);

  const loadPDFFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const files = await pdfService.getPDFFiles();
      setPdfFiles(files);
    } catch (err) {
      const apiError = err as APIError;
      setError(`Failed to load PDF files: ${apiError.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadPDF = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await pdfService.uploadPDF(file);
      
      if (response.success && response.file) {
        setPdfFiles(prev => [...prev, response.file!]);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err) {
      const apiError = err as APIError;
      setError(`Upload failed: ${apiError.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePDF = useCallback(async (fileId: string) => {
    try {
      setError(null);
      await pdfService.deletePDF(fileId);
      
      // Remove from both pdfFiles and assembled arrays
      setPdfFiles(prev => prev.filter(file => file.id !== fileId));
      setAssembled(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      const apiError = err as APIError;
      setError(`Delete failed: ${apiError.message}`);
      throw err;
    }
  }, []);

  const assemblePDFs = useCallback(async (outputName?: string) => {
    if (assembled.length === 0) {
      setError('No PDFs selected for assembly');
      return;
    }

    try {
      setIsAssembling(true);
      setAssemblyProgress(0);
      setError(null);
      setDownloadUrl(null);

      const request: AssemblyRequest = {
        pdfIds: assembled.map(file => file.id),
        outputName: outputName || `assembled_${Date.now()}.pdf`
      };

      const response = await pdfService.assemblePDFs(request);
      setCurrentJobId(response.jobId);

      if (response.status === 'completed' && response.downloadUrl) {
        setDownloadUrl(response.downloadUrl);
        setIsAssembling(false);
        setAssemblyProgress(100);
      }
    } catch (err) {
      const apiError = err as APIError;
      setError(`Assembly failed: ${apiError.message}`);
      setIsAssembling(false);
      setAssemblyProgress(0);
    }
  }, [assembled]);

  const checkAssemblyStatus = useCallback(async (jobId: string) => {
    try {
      const status: JobStatus = await pdfService.getAssemblyStatus(jobId);
      
      if (status.progress !== undefined) {
        setAssemblyProgress(status.progress);
      }

      if (status.status === 'completed') {
        setIsAssembling(false);
        setAssemblyProgress(100);
        // Keep currentJobId for potential future use, but we're using downloadUrl for download
        
        if (status.downloadUrl) {
          setDownloadUrl(status.downloadUrl);
        }
      } else if (status.status === 'failed') {
        setIsAssembling(false);
        setAssemblyProgress(0);
        setCurrentJobId(null);
        setError(`Assembly failed: ${status.error || 'Unknown error'}`);
      }
    } catch (err) {
      const apiError = err as APIError;
      setError(`Status check failed: ${apiError.message}`);
      setIsAssembling(false);
      setCurrentJobId(null);
    }
  }, []);

  const downloadAssembledPDF = useCallback(async () => {
    if (!downloadUrl) {
      setError('No assembly job available for download');
      return;
    }

    try {
      setError(null);
      
      // Extract jobId from downloadUrl
      const jobIdMatch = downloadUrl.match(/\/assemble\/([^/]+)\/download/);
      if (!jobIdMatch) {
        setError('Invalid download URL');
        return;
      }
      
      const jobId = jobIdMatch[1];
      const blob = await pdfService.downloadAssembledPDF(jobId);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assembled_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const apiError = err as APIError;
      setError(`Download failed: ${apiError.message}`);
    }
  }, [downloadUrl]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    pdfFiles,
    assembled,
    isLoading,
    isAssembling,
    assemblyProgress,
    downloadUrl,
    error,
    
    // Actions
    uploadPDF,
    deletePDF,
    assemblePDFs,
    downloadAssembledPDF,
    clearError,
    
    // Drag and drop helpers
    setAssembled,
  };
};
