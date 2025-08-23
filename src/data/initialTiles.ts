import { PDFFile } from '../types';

export const initialTiles: PDFFile[] = [
  { 
    id: "1", 
    name: "PDF 1",
    filename: "pdf1.pdf",
    size: 1024,
    uploadedAt: new Date().toISOString()
  },
  { 
    id: "2", 
    name: "PDF 2",
    filename: "pdf2.pdf",
    size: 2048,
    uploadedAt: new Date().toISOString()
  },
  { 
    id: "3", 
    name: "PDF 3",
    filename: "pdf3.pdf",
    size: 3072,
    uploadedAt: new Date().toISOString()
  },
  { 
    id: "4", 
    name: "PDF 4",
    filename: "pdf4.pdf",
    size: 4096,
    uploadedAt: new Date().toISOString()
  },
  { 
    id: "5", 
    name: "PDF 5",
    filename: "pdf5.pdf",
    size: 5120,
    uploadedAt: new Date().toISOString()
  },
];
