import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { PDFTile as PDFTileType } from '../../types';
import { PDFTile } from '../PDFTile';
import './PDFGrid.css';

interface PDFGridProps {
  tiles: PDFTileType[];
}

export const PDFGrid: React.FC<PDFGridProps> = ({ tiles }) => {
  return (
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
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
