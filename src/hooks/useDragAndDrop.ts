import { useState, useCallback } from 'react';
import { PDFFile, DragResult } from '../types';
import { handleDragEnd } from '../utils/dragHelpers';

export const useDragAndDrop = (initialTiles: PDFFile[]) => {
  const [tiles] = useState<PDFFile[]>(initialTiles);
  const [assembled, setAssembled] = useState<PDFFile[]>([]);

  const onDragEnd = useCallback((result: DragResult) => {
    handleDragEnd(result, tiles, assembled, setAssembled);
  }, [tiles, assembled]);

  return {
    tiles,
    assembled,
    onDragEnd,
  };
};
