import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { PDFFile } from '../../types';
import { PDFTile } from '../PDFTile';
import './AssemblyPanel.css';

interface AssemblyPanelProps {
  assembled: PDFFile[];
  onAssemble: () => Promise<void>;
  isAssembling?: boolean;
  assemblyProgress?: number;
  downloadUrl?: string;
  onDownload?: () => Promise<void>;
}

export const AssemblyPanel: React.FC<AssemblyPanelProps> = ({ 
  assembled, 
  onAssemble, 
  isAssembling = false,
  assemblyProgress = 0,
  downloadUrl,
  onDownload
}) => {
  const [outputName, setOutputName] = useState('');

  const handleAssemble = async () => {
    if (assembled.length === 0) {
      alert('Please add PDFs to assemble');
      return;
    }
    await onAssemble();
  };

  const handleDownload = async () => {
    if (onDownload) {
      await onDownload();
    }
  };

  return (
    <Droppable droppableId="panel">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="assembly-panel"
        >
          <h2 className="assembly-panel__title">Assembled PDF</h2>
          
          <div className="assembly-panel__controls">
            <input
              type="text"
              placeholder="Output filename (optional)"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="assembly-panel__filename-input"
              disabled={isAssembling}
            />
            
            <button
              onClick={handleAssemble}
              disabled={isAssembling || assembled.length === 0}
              className="assembly-panel__assemble-button"
            >
              {isAssembling ? 'Assembling...' : 'Assemble PDF'}
            </button>
          </div>

          {isAssembling && (
            <div className="assembly-panel__progress">
              <div className="assembly-panel__progress-text">
                Assembling PDF... {assemblyProgress}%
              </div>
              <div className="assembly-panel__progress-bar">
                <div 
                  className="assembly-panel__progress-fill"
                  style={{ width: `${assemblyProgress}%` }}
                />
              </div>
            </div>
          )}

          {downloadUrl && !isAssembling && (
            <div className="assembly-panel__download">
              <button
                onClick={handleDownload}
                className="assembly-panel__download-button"
              >
                📥 Download Assembled PDF
              </button>
            </div>
          )}

          <div className="assembly-panel__files">
            {assembled.map((tile, index) => (
              <PDFTile
                key={`${tile.id}-panel`}
                tile={tile}
                index={index}
                variant="panel"
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
