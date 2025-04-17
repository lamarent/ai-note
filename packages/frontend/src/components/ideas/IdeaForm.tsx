import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { Idea } from "../../services/api/ideaApi";

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
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Idea Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter your idea here..."
          required
        />
      </div>

      {categories.length > 0 && (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category (optional)
          </label>
          <select
            id="category"
            value={categoryId || ""}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
            className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {error && <div className="text-red-600 text-sm">{error}</div>}

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
