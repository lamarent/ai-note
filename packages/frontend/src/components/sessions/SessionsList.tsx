import { useState } from "react";
import {
  useSessions,
  useCreateSession,
  useDeleteSession,
} from "../../hooks/useSessions"; // Corrected import path
import { CreateSessionData, Session } from "../../api"; // Corrected import path and added Session type
import Button from "../common/Button"; // Import refactored Button
import { Link } from "react-router-dom"; // Import Link for navigation

export default function SessionsList() {
  // Use title in state to match CreateSessionData
  const [newSession, setNewSession] = useState<Partial<CreateSessionData>>({
    title: "",
    description: "",
    isPublic: false, // Default value if needed
  });

  // Query to fetch sessions
  const { data: sessions, isLoading, isError, error } = useSessions();

  // Mutations for creating and deleting sessions
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSession.title?.trim()) {
      // Prepare data including required fields
      const sessionData: CreateSessionData = {
        title: newSession.title.trim(),
        description: newSession.description?.trim() || undefined,
        ownerId: "00000000-0000-0000-0000-000000000000", // Placeholder ownerId
        isPublic: newSession.isPublic ?? false,
      };
      createSessionMutation.mutate(sessionData, {
        onSuccess: () => {
          // Reset form after successful creation
          setNewSession({
            title: "",
            description: "",
            isPublic: false,
          });
        },
      });
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setNewSession((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle session deletion
  const handleDelete = (id: string) => {
    // Use Modal for confirmation
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate(id);
    }
  };

  // Use loading spinner
  if (isLoading)
    return (
      <div className="flex justify-center items-center p-10">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );

  // Use alert for errors
  if (isError)
    return (
      <div role="alert" className="alert alert-error m-4">
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
          {error instanceof Error ? error.message : "Failed to load sessions"}
        </span>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Brainstorming Sessions</h2>

      {/* Create new session form - using DaisyUI Card and Form Controls */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-6 card bg-base-200 shadow-xl"
      >
        <h3 className="card-title mb-3">Create New Session</h3>

        <div className="form-control w-full mb-3">
          {/* Changed htmlFor and name to title */}
          <label htmlFor="title" className="label">
            <span className="label-text">Title</span>
            <span className="label-text-alt text-error">* Required</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newSession.title}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control w-full mb-3">
          <label htmlFor="description" className="label">
            <span className="label-text">Description (Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={newSession.description || ""}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>

        {/* Keep Public checkbox for consistency with type */}
        <div className="form-control mb-3">
          <label className="label cursor-pointer w-fit">
            <span className="label-text mr-4">Make this session public</span>
            <input
              type="checkbox"
              name="isPublic"
              checked={newSession.isPublic ?? false}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />
          </label>
        </div>

        <div className="card-actions justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={createSessionMutation.isPending}
            // Check title for disabling
            disabled={
              createSessionMutation.isPending || !newSession.title?.trim()
            }
          >
            Create Session
          </Button>
        </div>
      </form>

      {/* Sessions list - using DaisyUI Card */}
      {sessions?.length === 0 ? (
        <p className="text-base-content/70 italic">
          No sessions found. Create your first one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions?.map(
            (
              session: Session // Add Session type hint
            ) => (
              <div
                key={session.id}
                className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Make card body clickable link to session detail */}
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      to={`/sessions/${session.id}`}
                      className="card-title hover:text-primary transition-colors"
                    >
                      {session.title} {/* Use title */}
                    </Link>
                    {/* Delete button in card actions */}
                  </div>

                  {session.description && (
                    <p className="text-base-content/80 mb-3 line-clamp-2">
                      {session.description}
                    </p>
                  )}
                  <div className="card-actions justify-between items-center">
                    {/* Metadata */}
                    <div className="text-sm text-base-content/70">
                      {/* <span>{session.isPublic ? "Public" : "Private"}</span> */}
                      {/* Add idea count or other info if available */}
                      {/* <span>Ideas: {session.ideas?.length || 0}</span> */}
                    </div>
                    {/* Delete Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(session.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-error" // Error color for delete
                      isLoading={
                        deleteSessionMutation.isPending &&
                        deleteSessionMutation.variables === session.id
                      }
                      disabled={
                        deleteSessionMutation.isPending &&
                        deleteSessionMutation.variables === session.id
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
