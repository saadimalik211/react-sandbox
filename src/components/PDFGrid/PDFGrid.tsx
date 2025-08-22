import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { PDFFile } from '../../types';
import { PDFTile } from '../PDFTile';
import { PDFUpload } from '../PDFUpload';
import './PDFGrid.css';

interface PDFGridProps {
  tiles: PDFFile[];
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (fileId: string) => Promise<void>;
  isLoading?: boolean;
}

export const PDFGrid: React.FC<PDFGridProps> = ({ 
  tiles, 
  onFileUpload, 
  onFileDelete, 
  isLoading = false 
}) => {
  return (
    <div className="pdf-grid-container">
      <PDFUpload onUpload={onFileUpload} isLoading={isLoading} />
      
      <Droppable droppableId="grid" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="pdf-grid"
          >
            {tiles.map((tile, index) => (
              <PDFTile
                key={tile.id}
                tile={tile}
                index={index}
                variant="grid"
                onDelete={onFileDelete}
                showDeleteButton={true}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
