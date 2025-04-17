import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { Idea } from "../../services/api/ideaApi";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (idea: Idea) => void;
  className?: string;
  categoryColor?: string;
  isDraggable?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onEdit,
  onDelete,
  className = "",
  categoryColor,
  isDraggable = false,
}) => {
  // Handle dragging when isDraggable is true
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) return;

    // Set the drag data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        id: idea.id,
        type: "idea",
        initialX: e.clientX,
        initialY: e.clientY,
      })
    );

    // Use a custom drag image
    const dragImg = document.createElement("div");
    dragImg.className =
      "w-48 h-24 bg-blue-100 rounded-lg opacity-70 flex items-center justify-center";
    dragImg.textContent = "Moving idea...";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 24, 12);

    // Clean up after drag
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 0);
  };

  const colorBarStyle = categoryColor
    ? { borderLeftColor: categoryColor, borderLeftWidth: "4px" }
    : {};

  return (
    <div
      className={`idea-card ${className}`}
      style={colorBarStyle}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      data-idea-id={idea.id}
    >
      <Card
        className="relative shadow-md hover:shadow-lg transition-shadow"
        bodyClassName="p-3"
      >
        <p className="text-gray-700 whitespace-pre-wrap">{idea.content}</p>

        <div className="flex justify-end mt-2 space-x-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(idea)}
            className="opacity-60 hover:opacity-100"
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(idea)}
            className="opacity-60 hover:opacity-100"
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IdeaCard;
