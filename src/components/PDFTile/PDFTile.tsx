import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PDFTile as PDFTileType } from '../../types';
import './PDFTile.css';

interface PDFTileProps {
  tile: PDFTileType;
  index: number;
  variant?: 'grid' | 'panel';
}

export const PDFTile: React.FC<PDFTileProps> = ({ tile, index, variant = 'grid' }) => {
  const isGridVariant = variant === 'grid';
  
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
          {tile.name}
        </div>
      )}
    </Draggable>
  );
};
