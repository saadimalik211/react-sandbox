export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
}

export interface DragDropContextProps {
  onDragEnd: (result: DragResult) => void;
  children: React.ReactNode;
}

export interface DroppableProps {
  droppableId: string;
  direction?: 'horizontal' | 'vertical';
  children: (provided: any) => React.ReactNode;
}

export interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: any) => React.ReactNode;
}

// API Integration Types
export interface PDFFile {
  id: string;
  name: string;
  filename: string;
  size: number;
  uploadedAt: string;
  thumbnailUrl?: string;
}

export interface AssemblyRequest {
  pdfIds: string[];
  outputName?: string;
}

export interface AssemblyResponse {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
  estimatedTime?: number;
}

export interface JobStatus {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  downloadUrl?: string;
  error?: string;
  estimatedTime?: number;
}

export interface UploadResponse {
  success: boolean;
  file?: PDFFile;
  error?: string;
}

// API Error Types
export interface APIError {
  message: string;
  code: string;
  details?: any;
}

// Component Props for API Integration
export interface PDFGridProps {
  tiles: PDFFile[];
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (fileId: string) => Promise<void>;
  isLoading?: boolean;
}

export interface AssemblyPanelProps {
  assembled: PDFFile[];
  onAssemble: () => Promise<void>;
  isAssembling?: boolean;
  assemblyProgress?: number;
  downloadUrl?: string;
  onDownload?: () => Promise<void>;
}
