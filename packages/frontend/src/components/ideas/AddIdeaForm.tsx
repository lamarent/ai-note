import React, { useState } from "react";
import { CreateIdea } from "@ai-brainstorm/types";

interface AddIdeaFormProps {
  sessionId: string;
  onIdeaAdded?: () => void;
}

const AddIdeaForm: React.FC<AddIdeaFormProps> = ({
  sessionId,
  onIdeaAdded,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Idea content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const ideaData: CreateIdea = {
      content: content.trim(),
      sessionId,
      // Position would be added by the backend or set later when placing on the board
    };

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ideaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create idea");
      }

      // Clear the form after successful submission
      setContent("");

      // Call the callback if provided
      if (onIdeaAdded) {
        onIdeaAdded();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add idea");
      console.error("Error adding idea:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-3 text-base-content">
        Add New Idea
      </h3>

      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <textarea
            className={`textarea textarea-bordered ${error ? "textarea-error" : ""}`}
            rows={3}
            placeholder="Type your idea here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            aria-invalid={!!error}
            aria-describedby={error ? "idea-error" : undefined}
          />
          {error && (
            <span id="idea-error" className="sr-only">
              {error}
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting && (
              <span className="loading loading-spinner loading-xs mr-2"></span>
            )}
            {isSubmitting ? "Adding..." : "Add Idea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIdeaForm;
