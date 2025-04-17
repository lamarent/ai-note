import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { Idea } from "@ai-brainstorm/types";

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

    // Use a custom drag image with DaisyUI colors
    const dragImg = document.createElement("div");
    dragImg.className =
      "w-48 h-24 bg-base-200 text-base-content rounded-lg opacity-80 flex items-center justify-center shadow-lg";
    dragImg.textContent = "Moving idea...";
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 24, 12);

    // Clean up after drag
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 0);
  };

  // Use CSS variable for dynamic border color
  const cardStyle = categoryColor
    ? ({
        "--category-color": categoryColor,
        borderLeftWidth: "4px",
        borderColor: "var(--category-color)",
      } as React.CSSProperties)
    : {};

  return (
    <div
      className={`idea-card border-l-4 ${className}`}
      style={cardStyle}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      data-idea-id={idea.id}
    >
      <Card
        className="relative shadow-md hover:shadow-lg transition-shadow"
        bodyClassName="p-3"
      >
        <p className="text-base-content whitespace-pre-wrap">{idea.content}</p>

        <div className="card-actions justify-end mt-2 space-x-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(idea)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="error"
            ghost
            onClick={() => onDelete(idea)}
          >
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IdeaCard;
