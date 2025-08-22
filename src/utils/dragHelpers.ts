import { DragResult, PDFTile } from '../types';

export const handleDragEnd = (
  result: DragResult,
  tiles: PDFTile[],
  assembled: PDFTile[],
  setAssembled: (assembled: PDFTile[]) => void
): void => {
  const { source, destination } = result;
  
  if (!destination) return;

  // From grid -> panel
  if (source.droppableId === "grid" && destination.droppableId === "panel") {
    const tile = tiles[source.index];
    const newAssembled = Array.from(assembled);
    newAssembled.splice(destination.index, 0, tile);
    setAssembled(newAssembled);
  }

  // Reordering inside panel
  if (source.droppableId === "panel" && destination.droppableId === "panel") {
    const newAssembled = Array.from(assembled);
    const [moved] = newAssembled.splice(source.index, 1);
    newAssembled.splice(destination.index, 0, moved);
    setAssembled(newAssembled);
  }
};
