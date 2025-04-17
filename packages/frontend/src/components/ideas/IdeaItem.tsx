import React from "react";
import Button from "../common/Button";
import { Idea } from "@ai-brainstorm/types";

interface IdeaItemProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

const IdeaItem: React.FC<IdeaItemProps> = ({ idea, onEdit, onDelete }) => (
  <div className="p-4 rounded-md bg-base-200 shadow-sm">
    <p className="text-base-content mb-2">{idea.content}</p>
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" size="sm" onClick={() => onEdit(idea)}>
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-error"
        onClick={() => onDelete(idea.id)}
      >
        Delete
      </Button>
    </div>
  </div>
);

export default IdeaItem;
