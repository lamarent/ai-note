import { useState } from "react";
import {
  useGetIdeasBySession,
  useCreateIdea,
  useDeleteIdea,
  useUpdateIdea,
} from "../../hooks";
import Button from "../common/Button";
import { Idea } from "@ai-brainstorm/types";
import Modal from "../common/Modal";
import IdeaForm from "./IdeaForm";
import IdeaCard from "./IdeaCard";

interface IdeasListProps {
  sessionId: string;
}

export default function IdeasList({ sessionId }: IdeasListProps) {
  const {
    data: ideas = [],
    isLoading,
    isError,
    error,
  } = useGetIdeasBySession(sessionId);
  const createIdeaMutation = useCreateIdea();
  const updateIdeaMutation = useUpdateIdea();
  const deleteIdeaMutation = useDeleteIdea();

  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [deleteModalIdeaId, setDeleteModalIdeaId] = useState<string | null>(
    null
  );

  const handleEditSubmit = (data: { content: string; categoryId?: string }) => {
    if (editingIdeaId) {
      updateIdeaMutation.mutate(
        { id: editingIdeaId, data },
        { onSuccess: () => setEditingIdeaId(null) }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModalIdeaId) {
      deleteIdeaMutation.mutate(deleteModalIdeaId, {
        onSuccess: () => setDeleteModalIdeaId(null),
      });
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
    <div className="mt-6">
      <IdeaForm
        initialIdea={{}}
        onSubmit={(data) =>
          createIdeaMutation.mutate(
            {
              ...data,
              sessionId,
            },
            { onSuccess: () => {} }
          )
        }
        onCancel={() => {}}
        isLoading={createIdeaMutation.isPending}
        error={createIdeaMutation.error?.message}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ideas ({ideas.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) =>
          editingIdeaId === idea.id ? (
            <IdeaForm
              key={idea.id}
              initialIdea={idea}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingIdeaId(null)}
              isLoading={updateIdeaMutation.isPending}
              error={updateIdeaMutation.error?.message}
            />
          ) : (
            <IdeaCard
              key={idea.id}
              idea={idea as Idea}
              onEdit={() => setEditingIdeaId(idea.id)}
              onDelete={(ideaToDelete) => setDeleteModalIdeaId(ideaToDelete.id)}
            />
          )
        )}
      </div>

      <Modal
        isOpen={!!deleteModalIdeaId}
        onClose={() => setDeleteModalIdeaId(null)}
        title="Delete Idea"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModalIdeaId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteIdeaMutation.isPending}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete this idea? This action cannot be
          undone.
        </p>
        {deleteIdeaMutation.isError && (
          <div className="mt-4 text-red-600 text-sm">
            {deleteIdeaMutation.error?.message}
          </div>
        )}
      </Modal>
    </div>
  );
}
