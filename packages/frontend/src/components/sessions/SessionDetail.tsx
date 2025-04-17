import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import IdeasList from "./IdeasList";
import {
  useGetSession,
  useDeleteSession,
  useUpdateSession,
} from "../api/hooks";
import { UpdateSessionData } from "../api/types";

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ensure id is defined
  if (!id) {
    return <div className="p-4">Session ID is missing</div>;
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

  if (isLoading) return <div className="p-4">Loading session...</div>;

  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load session"}
      </div>
    );

  if (!session) return <div className="p-4">Session not found</div>;

  return (
    <div className="container mx-auto p-4">
      {isEditing ? (
        // Edit form
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-50"
        >
          <h2 className="text-xl font-bold mb-4">Edit Session</h2>

          <div className="mb-3">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editFormData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={editFormData.description || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={updateSessionMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {updateSessionMutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // Session details
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{session.name}</h1>
            <div>
              <button
                onClick={startEditing}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={deleteSessionMutation.isPending}
              >
                {deleteSessionMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {session.description && (
            <p className="text-gray-700 mb-4">{session.description}</p>
          )}

          <div className="text-sm text-gray-500">
            Created: {new Date(session.createdAt).toLocaleString()}
          </div>
          {session.updatedAt && (
            <div className="text-sm text-gray-500">
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
