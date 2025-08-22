const express = require('express');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// In-memory storage for jobs (in production, use Redis or database)
const jobs = new Map();
const pdfFiles = new Map();

// Routes

// Get all PDF files
app.get('/api/pdfs', (req, res) => {
  try {
    const files = Array.from(pdfFiles.values()).map(file => ({
      id: file.id,
      name: file.name,
      filename: file.filename,
      size: file.size,
      uploadedAt: file.uploadedAt,
      thumbnailUrl: `/api/pdfs/${file.id}/thumbnail`
    }));
    
    res.json(files);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve PDF files' 
    });
  }
});

// Upload PDF file
app.post('/api/pdfs/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const fileId = uuidv4();
    const fileInfo = {
      id: fileId,
      name: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      path: req.file.path
    };

    pdfFiles.set(fileId, fileInfo);

    res.json({
      success: true,
      file: {
        id: fileInfo.id,
        name: fileInfo.name,
        filename: fileInfo.filename,
        size: fileInfo.size,
        uploadedAt: fileInfo.uploadedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed' 
    });
  }
});

// Delete PDF file
app.delete('/api/pdfs/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = pdfFiles.get(fileId);

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Remove file from disk
    await fs.remove(file.path);
    pdfFiles.delete(fileId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Delete failed' 
    });
  }
});

// Get PDF thumbnail
app.get('/api/pdfs/:id/thumbnail', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = pdfFiles.get(fileId);

    if (!file) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // For simplicity, we'll return the first page as a thumbnail
    // In production, you'd want to generate actual thumbnails
    const pdfBytes = await fs.readFile(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    if (pages.length > 0) {
      // Create a thumbnail PDF with just the first page
      const thumbnailDoc = await PDFDocument.create();
      const [firstPage] = await thumbnailDoc.copyPages(pdfDoc, [0]);
      thumbnailDoc.addPage(firstPage);
      
      const thumbnailBytes = await thumbnailDoc.save();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="thumbnail-${fileId}.pdf"`);
      res.send(Buffer.from(thumbnailBytes));
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'No pages found in PDF' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Thumbnail generation failed' 
    });
  }
});

// Assemble PDFs
app.post('/api/pdfs/assemble', async (req, res) => {
  try {
    const { pdfIds, outputName } = req.body;

    if (!pdfIds || !Array.isArray(pdfIds) || pdfIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF IDs provided' 
      });
    }

    // Validate all PDFs exist
    const files = [];
    for (const id of pdfIds) {
      const file = pdfFiles.get(id);
      if (!file) {
        return res.status(404).json({ 
          success: false, 
          error: `PDF with ID ${id} not found` 
        });
      }
      files.push(file);
    }

    const jobId = uuidv4();
    const job = {
      id: jobId,
      status: 'processing',
      progress: 0,
      pdfIds,
      outputName: outputName || `assembled_${Date.now()}.pdf`,
      createdAt: new Date().toISOString()
    };

    jobs.set(jobId, job);

    // Start assembly process (async)
    assemblePDFs(jobId, files, job.outputName);

    res.json({
      jobId,
      status: 'processing',
      estimatedTime: files.length * 2 // Rough estimate: 2 seconds per PDF
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Assembly request failed' 
    });
  }
});

// Get assembly status
app.get('/api/pdfs/assemble/:jobId/status', (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = jobs.get(jobId);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found' 
      });
    }

    res.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      downloadUrl: job.status === 'completed' ? `/api/pdfs/assemble/${jobId}/download` : undefined,
      error: job.error,
      estimatedTime: job.estimatedTime
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Status check failed' 
    });
  }
});

// Download assembled PDF
app.get('/api/pdfs/assemble/:jobId/download', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = jobs.get(jobId);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found' 
      });
    }

    if (job.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Assembly not completed' 
      });
    }

    if (!job.outputPath) {
      return res.status(500).json({ 
        success: false, 
        error: 'Output file not found' 
      });
    }

    res.download(job.outputPath, job.outputName);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Download failed' 
    });
  }
});

// PDF Assembly function
async function assemblePDFs(jobId, files, outputName) {
  const job = jobs.get(jobId);
  
  try {
    // Create output directory
    const outputDir = path.join(__dirname, 'assembled');
    await fs.ensureDir(outputDir);
    
    const outputPath = path.join(outputDir, `${jobId}_${outputName}`);
    
    // Create new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Process each PDF
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Update progress
      job.progress = Math.round(((i + 1) / files.length) * 100);
      jobs.set(jobId, job);
      
      // Read PDF file
      const pdfBytes = await fs.readFile(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      
      // Copy all pages from this PDF
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }
    
    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedPdfBytes);
    
    // Update job status
    job.status = 'completed';
    job.progress = 100;
    job.outputPath = outputPath;
    job.completedAt = new Date().toISOString();
    jobs.set(jobId, job);
    
  } catch (error) {
    // Update job status on error
    job.status = 'failed';
    job.error = error.message;
    job.failedAt = new Date().toISOString();
    jobs.set(jobId, job);
  }
}

// Cleanup old jobs (run every hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  for (const [jobId, job] of jobs.entries()) {
    if (job.completedAt && new Date(job.completedAt) < oneHourAgo) {
      // Remove completed job and its output file
      if (job.outputPath) {
        fs.remove(job.outputPath).catch(console.error);
      }
      jobs.delete(jobId);
    }
  }
}, 60 * 60 * 1000);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Assembly API server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
