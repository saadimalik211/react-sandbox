import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { PDFGrid, AssemblyPanel } from './components';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { initialTiles } from './data/initialTiles';
import './App.css';

const App: React.FC = () => {
  const { tiles, assembled, onDragEnd } = useDragAndDrop(initialTiles);

  return (
    <div className="app">
      <DragDropContext onDragEnd={onDragEnd}>
        <PDFGrid tiles={tiles} />
        <AssemblyPanel assembled={assembled} />
      </DragDropContext>
    </div>
  );
};

export default App;
