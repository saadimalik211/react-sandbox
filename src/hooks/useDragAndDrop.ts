import { useState, useCallback } from 'react';
import { PDFTile, DragResult } from '../types';
import { handleDragEnd } from '../utils/dragHelpers';

export const useDragAndDrop = (initialTiles: PDFTile[]) => {
  const [tiles] = useState<PDFTile[]>(initialTiles);
  const [assembled, setAssembled] = useState<PDFTile[]>([]);

  const onDragEnd = useCallback((result: DragResult) => {
    handleDragEnd(result, tiles, assembled, setAssembled);
  }, [tiles, assembled]);

  return {
    tiles,
    assembled,
    onDragEnd,
  };
};
