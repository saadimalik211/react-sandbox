import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { PDFTile as PDFTileType } from '../../types';
import { PDFTile } from '../PDFTile';
import './AssemblyPanel.css';

interface AssemblyPanelProps {
  assembled: PDFTileType[];
}

export const AssemblyPanel: React.FC<AssemblyPanelProps> = ({ assembled }) => {
  return (
    <Droppable droppableId="panel">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="assembly-panel"
        >
          <h2 className="assembly-panel__title">Assembled PDF</h2>
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
      )}
    </Droppable>
  );
};
