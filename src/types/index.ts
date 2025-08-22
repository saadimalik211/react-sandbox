export interface PDFTile {
  id: string;
  name: string;
}

export interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
}

export interface DragDropContextProps {
  onDragEnd: (result: DragResult) => void;
  children: React.ReactNode;
}

export interface DroppableProps {
  droppableId: string;
  direction?: 'horizontal' | 'vertical';
  children: (provided: any) => React.ReactNode;
}

export interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: any) => React.ReactNode;
}
