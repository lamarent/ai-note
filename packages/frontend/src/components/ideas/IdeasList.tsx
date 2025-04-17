import { useState } from "react";
import {
  useGetSessionIdeas,
  useCreateIdea,
  useDeleteIdea,
  useUpdateIdea,
} from "../../api/hooks";
import { CreateIdeaData, UpdateIdeaData } from "../../api/types";
import Button from "../common/Button";

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

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-10">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div role="alert" className="alert alert-error my-4">
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
        <span>
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load ideas"}
        </span>
      </div>
    );

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Ideas</h2>

      <form onSubmit={handleCreateIdea} className="mb-6">
        <div className="join w-full">
          <input
            type="text"
            value={newIdeaContent}
            onChange={(e) => setNewIdeaContent(e.target.value)}
            placeholder="Add a new idea..."
            className="input input-bordered join-item flex-grow"
            required
            disabled={createIdeaMutation.isPending}
          />
          <Button
            type="submit"
            className="join-item"
            variant="primary"
            isLoading={createIdeaMutation.isPending}
            disabled={createIdeaMutation.isPending || !newIdeaContent.trim()}
          >
            {createIdeaMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
      </form>

      {ideas.length === 0 ? (
        <p className="text-base-content italic">
          No ideas yet. Add your first idea above!
        </p>
      ) : (
        <ul className="space-y-4">
          {ideas.map((idea) => (
            <li key={idea.id} className="p-4 rounded-md bg-base-200 shadow-sm">
              {editingIdeaId === idea.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                  <div className="flex space-x-2 justify-end">
                    <Button
                      onClick={() => handleUpdateIdea(idea.id)}
                      isLoading={updateIdeaMutation.isPending}
                      disabled={
                        updateIdeaMutation.isPending || !editContent.trim()
                      }
                      variant="primary"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button onClick={cancelEditing} variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-base-content mb-2">{idea.content}</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => startEditing(idea.id, idea.content)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteIdea(idea.id)}
                      isLoading={deleteIdeaMutation.isPending}
                      variant="ghost"
                      size="sm"
                      className="text-error"
                      disabled={deleteIdeaMutation.isPending}
                    >
                      Delete
                    </Button>
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
