import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import IdeasList from "../ideas/IdeasList";
import { useGetSession, useDeleteSession, useUpdateSession } from "../../hooks";
import { UpdateSessionData } from "../../api/types";
import Button from "../common/Button"; // Import refactored Button

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ensure id is defined
  if (!id) {
    // Use alert for error messages
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
        <span>Session ID is missing</span>
      </div>
    );
  }

  // Fetch session data
  const { data: session, isLoading, isError, error } = useGetSession(id);

  // Set up mutations
  const deleteSessionMutation = useDeleteSession();
  const updateSessionMutation = useUpdateSession();

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateSessionData>({
    name: "",
    description: "",
  });

  // Handle session deletion
  const handleDelete = () => {
    // Consider using a Modal component here
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate(id, {
        onSuccess: () => {
          navigate("/");
        },
      });
    }
  };

  // Initialize edit form
  const startEditing = () => {
    if (session) {
      setEditFormData({
        name: session.name,
        description: session.description || "",
      });
      setIsEditing(true);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSessionMutation.mutate(
      {
        id,
        data: editFormData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setEditFormData({
      ...editFormData,
      [name]: value,
    });
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
          {error instanceof Error ? error.message : "Failed to load session"}
        </span>
      </div>
    );

  // Use alert for not found
  if (!session)
    return (
      <div role="alert" className="alert alert-warning m-4">
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Session not found</span>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      {isEditing ? (
        // Edit form - use DaisyUI form controls and Button
        <form
          onSubmit={handleSubmit}
          // Use card or base styles for form background
          className="mb-6 p-6 card bg-base-200 shadow-xl"
        >
          <h2 className="card-title mb-4">Edit Session</h2>

          <div className="form-control w-full mb-3">
            <label htmlFor="name" className="label">
              <span className="label-text">Name</span>
              <span className="label-text-alt text-error">* Required</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editFormData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control w-full mb-4">
            <label htmlFor="description" className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={editFormData.description || ""}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={3}
            />
          </div>

          <div className="card-actions justify-end space-x-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={updateSessionMutation.isPending}
              disabled={
                updateSessionMutation.isPending || !editFormData.name.trim()
              }
            >
              Save
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        // Session details - use DaisyUI buttons and text colors
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-base-content">
              {session.name}
            </h1>
            <div className="space-x-2">
              <Button onClick={startEditing} variant="outline" size="sm">
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="error"
                outline // Make delete less prominent
                size="sm"
                isLoading={deleteSessionMutation.isPending}
                disabled={deleteSessionMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>

          {session.description && (
            <p className="text-base-content/80 mb-4">{session.description}</p> // Slightly muted content
          )}

          {/* Use muted text color for dates */}
          <div className="text-sm text-base-content/70">
            Created: {new Date(session.createdAt).toLocaleString()}
          </div>
          {session.updatedAt && (
            <div className="text-sm text-base-content/70">
              Last updated: {new Date(session.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {/* Ideas list for this session */}
      <IdeasList sessionId={id} />
    </div>
  );
}
