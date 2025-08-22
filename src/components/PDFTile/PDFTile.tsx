import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PDFFile } from '../../types';
import './PDFTile.css';

interface PDFTileProps {
  tile: PDFFile;
  index: number;
  variant?: 'grid' | 'panel';
  onDelete?: (fileId: string) => Promise<void>;
  showDeleteButton?: boolean;
}

export const PDFTile: React.FC<PDFTileProps> = ({ 
  tile, 
  index, 
  variant = 'grid',
  onDelete,
  showDeleteButton = false
}) => {
  const isGridVariant = variant === 'grid';
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      try {
        await onDelete(tile.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Draggable draggableId={isGridVariant ? tile.id : `${tile.id}-panel`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`pdf-tile pdf-tile--${variant}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className="pdf-tile__content">
            <div className="pdf-tile__name">{tile.name}</div>
            {variant === 'grid' && (
              <div className="pdf-tile__details">
                <span className="pdf-tile__size">{formatFileSize(tile.size)}</span>
                <span className="pdf-tile__date">
                  {new Date(tile.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          {showDeleteButton && onDelete && (
            <button
              className="pdf-tile__delete"
              onClick={handleDelete}
              title="Delete PDF"
            >
              ×
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};
