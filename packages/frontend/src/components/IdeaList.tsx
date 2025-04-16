import React, { useEffect, useState } from "react";
import { Idea, Category } from "@ai-brainstorm/types";

// Extended Idea type to include the category relation that comes from the API
interface IdeaWithCategory extends Idea {
  category?: Category | null;
}

interface IdeaListProps {
  sessionId: string;
  onIdeaDeleted?: (ideaId: string) => void; // Optional callback for deletion
}

const IdeaList: React.FC<IdeaListProps> = ({ sessionId, onIdeaDeleted }) => {
  const [ideas, setIdeas] = useState<IdeaWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}/ideas`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ideas: ${response.statusText}`);
        }
        const data = await response.json();
        setIdeas(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch ideas");
        console.error("Error fetching ideas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchIdeas();
    }
  }, [sessionId]);

  const handleUpvote = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/upvote`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to upvote idea: ${response.statusText}`);
      }

      const updatedIdea = await response.json();
      setIdeas(ideas.map((idea) => (idea.id === ideaId ? updatedIdea : idea)));
    } catch (err) {
      console.error("Error upvoting idea:", err);
    }
  };

  const handleDelete = async (ideaId: string) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) {
      return;
    }
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Idea not found");
        }
        throw new Error(`Failed to delete idea: ${response.statusText}`);
      }

      setIdeas(ideas.filter((idea) => idea.id !== ideaId));
      setError(null);
      if (onIdeaDeleted) {
        onIdeaDeleted(ideaId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete idea");
      console.error("Error deleting idea:", err);
    }
  };

  const startEditing = (idea: IdeaWithCategory) => {
    setEditingIdeaId(idea.id);
    setEditingContent(idea.content);
  };

  const cancelEditing = () => {
    setEditingIdeaId(null);
    setEditingContent("");
  };

  const handleEditSubmit = async (e: React.FormEvent, ideaId: string) => {
    e.preventDefault();
    if (!editingContent.trim()) {
      setError("Idea content cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingContent.trim() }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Idea not found");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update idea");
      }

      const updatedIdea = await response.json();
      setIdeas(ideas.map((idea) => (idea.id === ideaId ? updatedIdea : idea)));
      cancelEditing(); // Exit editing mode
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update idea");
      console.error("Error updating idea:", err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading ideas...</div>;
  }

  if (error && !editingIdeaId) {
    // Only show general error if not editing
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (ideas.length === 0) {
    return (
      <div className="p-4 text-center">No ideas yet. Add your first idea!</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          {editingIdeaId === idea.id ? (
            <form
              onSubmit={(e) => handleEditSubmit(e, idea.id)}
              className="flex-grow"
            >
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                rows={3}
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button type="submit" className="btn btn-sm btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    idea.category
                      ? `bg-${idea.category.color}-100 text-${idea.category.color}-800`
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {idea.category?.name || "Uncategorized"}
                </div>
                <button
                  onClick={() => handleUpvote(idea.id)}
                  className="text-gray-500 hover:text-blue-500 flex items-center text-sm p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span>{idea.upvotes}</span>
                </button>
              </div>
              <p className="text-gray-700 mb-3 break-words">{idea.content}</p>
            </div>
          )}

          {editingIdeaId !== idea.id && (
            <div className="flex justify-end space-x-1 mt-2">
              <button
                onClick={() => startEditing(idea)}
                className="btn btn-xs btn-ghost text-gray-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(idea.id)}
                className="btn btn-xs btn-ghost text-gray-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IdeaList;
