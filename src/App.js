import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import "./App.css";

const initialTiles = [
  { id: "1", name: "PDF 1" },
  { id: "2", name: "PDF 2" },
  { id: "3", name: "PDF 3" },
  { id: "4", name: "PDF 4" },
  { id: "5", name: "PDF 5" },
];

function App() {
  const [tiles] = useState(initialTiles); // left-side static grid
  const [assembled, setAssembled] = useState([]); // right-side panel

  const onDragEnd = (result) => {
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
    if (
      source.droppableId === "panel" &&
      destination.droppableId === "panel"
    ) {
      const newAssembled = Array.from(assembled);
      const [moved] = newAssembled.splice(source.index, 1);
      newAssembled.splice(destination.index, 0, moved);
      setAssembled(newAssembled);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "1rem",
        height: "100vh",
        background: "#333",
        color: "white",
        padding: "1rem",
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Left: PDF Grid */}
        <Droppable droppableId="grid" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "1rem",
                background: "#444",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              {tiles.map((tile, index) => (
                <Draggable
                  key={tile.id}
                  draggableId={tile.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: "none",
                        aspectRatio: "1 / 1", // ✅ square tiles
                        background: "#666",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {tile.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Right: Assembled Panel */}
        <Droppable droppableId="panel">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background: "#222",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                minHeight: "100%",
              }}
            >
              <h2>Assembled PDF</h2>
              {assembled.map((tile, index) => (
                <Draggable
                  key={tile.id + "-panel"}
                  draggableId={tile.id + "-panel"}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: "1rem",
                        background: "#555",
                        borderRadius: "6px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {tile.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;

