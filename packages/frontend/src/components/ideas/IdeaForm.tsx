import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { Idea } from "@ai-brainstorm/types";

interface IdeaFormProps {
  initialIdea?: Partial<Idea>;
  onSubmit: (data: { content: string; categoryId?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
  categories?: Array<{ id: string; name: string; color: string }>;
}

const IdeaForm: React.FC<IdeaFormProps> = ({
  initialIdea,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  categories = [],
}) => {
  const [content, setContent] = useState(initialIdea?.content || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(
    initialIdea?.categoryId
  );

  // Update form values if initialIdea changes
  useEffect(() => {
    if (initialIdea) {
      setContent(initialIdea.content || "");
      setCategoryId(initialIdea.categoryId);
    }
  }, [initialIdea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!content.trim()) return;

    onSubmit({
      content: content.trim(),
      categoryId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <div className="label-text">Idea Content</div>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`textarea textarea-bordered w-full ${error ? "textarea-error" : ""}`}
          rows={3}
          placeholder="Enter your idea here..."
          required
          aria-invalid={!!error}
          aria-describedby={error ? "content-error" : undefined}
        />
        {error && (
          <label className="label" id="content-error">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>

      {categories.length > 0 && (
        <div className="form-control">
          <label htmlFor="category" className="label">
            <span className="label-text">Category (optional)</span>
          </label>
          <select
            id="category"
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
            className="select select-bordered"
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!content.trim() || isLoading}
        >
          {initialIdea?.id ? "Update" : "Add"} Idea
        </Button>
      </div>
    </form>
  );
};

export default IdeaForm;
