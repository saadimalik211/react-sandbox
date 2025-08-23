import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { PDFGrid, AssemblyPanel } from './components';
import { usePDFManagement } from './hooks/usePDFManagement';
import { handleDragEnd } from './utils/dragHelpers';
import './App.css';

const App: React.FC = () => {
  const {
    pdfFiles,
    assembled,
    isLoading,
    isAssembling,
    assemblyProgress,
    downloadUrl,
    error,
    uploadPDF,
    deletePDF,
    assemblePDFs,
    downloadAssembledPDF,
    clearError,
    setAssembled,
  } = usePDFManagement();

  const onDragEnd = (result: any) => {
    handleDragEnd(result, pdfFiles, assembled, setAssembled);
  };

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <PDFGrid 
          tiles={pdfFiles}
          onFileUpload={uploadPDF}
          onFileDelete={deletePDF}
          isLoading={isLoading}
        />
        <AssemblyPanel 
          assembled={assembled}
          onAssemble={assemblePDFs}
          isAssembling={isAssembling}
          assemblyProgress={assemblyProgress}
          downloadUrl={downloadUrl || undefined}
          onDownload={downloadAssembledPDF}
        />
      </DragDropContext>
    </div>
  );
};

export default App;
