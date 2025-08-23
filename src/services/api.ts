import { 
  PDFFile, 
  AssemblyRequest, 
  AssemblyResponse, 
  JobStatus, 
  UploadResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class PDFService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          errorData.code || 'UNKNOWN_ERROR',
          response.status,
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        'Network error',
        'NETWORK_ERROR',
        0,
        error
      );
    }
  }

  // Get all available PDF files
  async getPDFFiles(): Promise<PDFFile[]> {
    return this.request<PDFFile[]>('/pdfs');
  }

  // Upload a new PDF file
  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${API_BASE_URL}/pdfs/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || 'Upload failed',
        errorData.code || 'UPLOAD_ERROR',
        response.status
      );
    }

    return response.json();
  }

  // Delete a PDF file
  async deletePDF(fileId: string): Promise<void> {
    await this.request(`/pdfs/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Start PDF assembly process
  async assemblePDFs(request: AssemblyRequest): Promise<AssemblyResponse> {
    return this.request<AssemblyResponse>('/pdfs/assemble', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Check assembly job status
  async getAssemblyStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/pdfs/assemble/${jobId}/status`);
  }

  // Download assembled PDF
  async downloadAssembledPDF(jobId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/pdfs/assemble/${jobId}/download`);
    
    if (!response.ok) {
      throw new APIError(
        'Download failed',
        'DOWNLOAD_ERROR',
        response.status
      );
    }

    return response.blob();
  }

  // Get PDF thumbnail
  async getPDFThumbnail(fileId: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/pdfs/${fileId}/thumbnail`);
    
    if (!response.ok) {
      throw new APIError(
        'Thumbnail generation failed',
        'THUMBNAIL_ERROR',
        response.status
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}

export const pdfService = new PDFService();
export { APIError };
