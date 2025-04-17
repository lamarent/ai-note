import { useState } from "react";
import {
  useGetSessionIdeas,
  useCreateIdea,
  useDeleteIdea,
  useUpdateIdea,
} from "../api/hooks";
import { CreateIdeaData, UpdateIdeaData } from "../api/types";

interface IdeasListProps {
  sessionId: string;
}

export default function IdeasList({ sessionId }: IdeasListProps) {
  const {
    data: ideas = [],
    isLoading,
    isError,
    error,
  } = useGetSessionIdeas(sessionId);
  const createIdeaMutation = useCreateIdea();
  const updateIdeaMutation = useUpdateIdea();
  const deleteIdeaMutation = useDeleteIdea();

  const [newIdeaContent, setNewIdeaContent] = useState("");
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaContent.trim()) return;

    const newIdea: CreateIdeaData = {
      content: newIdeaContent.trim(),
      sessionId,
    };

    createIdeaMutation.mutate(newIdea, {
      onSuccess: () => {
        setNewIdeaContent("");
      },
    });
  };

  const startEditing = (id: string, content: string) => {
    setEditingIdeaId(id);
    setEditContent(content);
  };

  const cancelEditing = () => {
    setEditingIdeaId(null);
    setEditContent("");
  };

  const handleUpdateIdea = (id: string) => {
    if (!editContent.trim()) return;

    const updatedIdea: UpdateIdeaData = {
      content: editContent.trim(),
    };

    updateIdeaMutation.mutate(
      {
        id,
        data: updatedIdea,
      },
      {
        onSuccess: () => {
          setEditingIdeaId(null);
          setEditContent("");
        },
      }
    );
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      deleteIdeaMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="mt-4">Loading ideas...</div>;

  if (isError)
    return (
      <div className="mt-4 text-red-500">
        Error: {error instanceof Error ? error.message : "Failed to load ideas"}
      </div>
    );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Ideas</h2>

      {/* Add new idea form */}
      <form onSubmit={handleCreateIdea} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newIdeaContent}
            onChange={(e) => setNewIdeaContent(e.target.value)}
            placeholder="Add a new idea..."
            className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={createIdeaMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 disabled:bg-green-300"
          >
            {createIdeaMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {/* Ideas list */}
      {ideas.length === 0 ? (
        <p className="text-gray-500 italic">
          No ideas yet. Add your first idea above!
        </p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li
              key={idea.id}
              className="p-4 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {editingIdeaId === idea.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateIdea(idea.id)}
                      disabled={updateIdeaMutation.isPending}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                    >
                      {updateIdeaMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-800">{idea.content}</p>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => startEditing(idea.id, idea.content)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      disabled={deleteIdeaMutation.isPending}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
