import React, { useState } from "react";

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

    const ideaData: Partial<CreateIdea> = {
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
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-3">Add New Idea</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Type your idea here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Adding..." : "Add Idea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIdeaForm;
