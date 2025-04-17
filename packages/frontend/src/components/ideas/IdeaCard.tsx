import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { Idea } from "@ai-brainstorm/types";
import { format } from "date-fns";

interface IdeaCardProps {
  idea: Idea;
  onEdit: () => void;
  onDelete: (idea: Idea) => void;
  onClick?: () => void;
  isSelectable?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  onEdit,
  onDelete,
  onClick,
  isSelectable = false,
}) => {
  const formattedDate = format(new Date(idea.createdAt), "MMM d, yyyy");

  // Card classes include cursor-pointer when selectable
  const cardClasses = `${isSelectable ? "cursor-pointer hover:bg-base-200" : ""}`;

  return (
    <Card
      className={cardClasses}
      onClick={onClick}
      data-testid={`idea-card-${idea.id}`}
    >
      <div className="mb-4">
        <p>{idea.content}</p>
      </div>
      <div className="flex justify-between items-center text-xs opacity-70">
        <span>{formattedDate}</span>
        {idea.isAiGenerated && (
          <span className="badge badge-secondary">AI Generated</span>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-base-300">
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            onEdit();
          }}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onClick
            onDelete(idea);
          }}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default IdeaCard;
