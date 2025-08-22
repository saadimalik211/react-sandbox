# PDF Assembly Backend API

A Node.js/Express backend API that handles PDF file uploads, storage, and assembly operations. This backend integrates seamlessly with the React frontend to provide a complete PDF assembly solution.

## 🚀 Features

- **PDF File Upload**: Secure file upload with validation and size limits
- **PDF Storage**: Organized file storage with unique identifiers
- **PDF Assembly**: Merge multiple PDFs into a single document
- **Job Management**: Asynchronous processing with progress tracking
- **Thumbnail Generation**: PDF preview generation
- **File Management**: Upload, delete, and retrieve PDF files
- **RESTful API**: Clean, documented API endpoints
- **Error Handling**: Comprehensive error handling and validation

## 🛠️ Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **pdf-lib**: PDF manipulation library
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **UUID**: Unique identifier generation
- **fs-extra**: Enhanced file system operations

## 📁 Project Structure

```
backend-example/
├── 📄 package.json          # Dependencies and scripts
├── 📄 server.js             # Main server file
├── 📄 README.md             # This documentation
├── 📁 uploads/              # Uploaded PDF files (auto-created)
├── 📁 assembled/            # Assembled PDF outputs (auto-created)
└── 📄 .env                  # Environment variables (create this)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the backend directory**
   ```bash
   cd backend-example
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3001/api`

## 📡 API Endpoints

### PDF Management

#### GET `/api/pdfs`
Retrieve all uploaded PDF files.

**Response:**
```json
[
  {
    "id": "uuid-string",
    "name": "document.pdf",
    "filename": "uuid-document.pdf",
    "size": 1024000,
    "uploadedAt": "2024-01-01T12:00:00.000Z",
    "thumbnailUrl": "/api/pdfs/uuid-string/thumbnail"
  }
]
```

#### POST `/api/pdfs/upload`
Upload a new PDF file.

**Request:** `multipart/form-data`
- `pdf`: PDF file

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "uuid-string",
    "name": "document.pdf",
    "filename": "uuid-document.pdf",
    "size": 1024000,
    "uploadedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### DELETE `/api/pdfs/:id`
Delete a PDF file.

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/pdfs/:id/thumbnail`
Get PDF thumbnail (first page).

**Response:** PDF file stream

### PDF Assembly

#### POST `/api/pdfs/assemble`
Start PDF assembly process.

**Request:**
```json
{
  "pdfIds": ["uuid1", "uuid2", "uuid3"],
  "outputName": "assembled-document.pdf"
}
```

**Response:**
```json
{
  "jobId": "job-uuid",
  "status": "processing",
  "estimatedTime": 6
}
```

#### GET `/api/pdfs/assemble/:jobId/status`
Check assembly job status.

**Response:**
```json
{
  "jobId": "job-uuid",
  "status": "completed",
  "progress": 100,
  "downloadUrl": "/api/pdfs/assemble/job-uuid/download",
  "estimatedTime": 6
}
```

#### GET `/api/pdfs/assemble/:jobId/download`
Download assembled PDF.

**Response:** PDF file download

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Storage Paths
UPLOAD_DIR=./uploads
ASSEMBLED_DIR=./assembled

# Security
CORS_ORIGIN=http://localhost:3000
```

### File Upload Configuration

The server is configured with the following upload settings:

- **File Type**: PDF only (`application/pdf`)
- **Max Size**: 10MB per file
- **Storage**: Local disk with unique filenames
- **Validation**: MIME type and file extension checking

## 🔄 Integration with Frontend

### Frontend Configuration

In your React frontend, set the API base URL:

```typescript
// src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
```

### Environment Setup

Create a `.env` file in your React project root:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

### CORS Configuration

The backend is configured to allow requests from the frontend:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **File Validation**: MIME type and extension checking
- **Size Limits**: Configurable file size restrictions
- **CORS**: Controlled cross-origin access
- **Error Handling**: Secure error responses
- **Input Validation**: Request parameter validation

## 📊 Job Management

### Job States
- **processing**: Assembly in progress
- **completed**: Assembly finished successfully
- **failed**: Assembly failed with error

### Progress Tracking
- Real-time progress updates (0-100%)
- Estimated completion time
- Error details for failed jobs

### Cleanup
- Automatic cleanup of completed jobs after 1 hour
- Removal of temporary files
- Memory management for job storage

## 🚀 Production Deployment

### Recommended Setup

1. **Use a Process Manager**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "pdf-assembly-api"
   ```

2. **Add Database Storage**
   - Replace in-memory storage with Redis or PostgreSQL
   - Implement proper job queuing with Bull or similar

3. **File Storage**
   - Use cloud storage (AWS S3, Google Cloud Storage)
   - Implement CDN for file delivery

4. **Security**
   - Add authentication and authorization
   - Implement rate limiting
   - Use HTTPS in production

5. **Monitoring**
   - Add logging with Winston or similar
   - Implement health checks
   - Add metrics collection

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing

Use tools like Postman or curl to test the API:

```bash
# Upload a PDF
curl -X POST -F "pdf=@document.pdf" http://localhost:3001/api/pdfs/upload

# Get all PDFs
curl http://localhost:3001/api/pdfs

# Assemble PDFs
curl -X POST -H "Content-Type: application/json" \
  -d '{"pdfIds":["uuid1","uuid2"]}' \
  http://localhost:3001/api/pdfs/assemble
```

### Automated Testing

```bash
npm test
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGIN is set correctly
   - Check frontend URL matches backend configuration

2. **File Upload Failures**
   - Verify file is PDF format
   - Check file size limits
   - Ensure upload directory has write permissions

3. **Assembly Failures**
   - Check PDF file integrity
   - Verify all PDF IDs exist
   - Monitor server logs for errors

4. **Memory Issues**
   - Large PDFs may cause memory problems
   - Consider streaming for large files
   - Implement proper cleanup

## 📈 Performance Considerations

- **File Size Limits**: Configure appropriate limits for your use case
- **Concurrent Processing**: Implement job queuing for multiple requests
- **Caching**: Cache thumbnails and frequently accessed files
- **CDN**: Use CDN for file delivery in production
- **Database**: Use proper database for job and file metadata

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
