import { useState } from "react";
import { useSessions, useCreateSession, useDeleteSession } from "../hooks";
import { CreateSessionData } from "../api";

export default function SessionsList() {
  const [newSession, setNewSession] = useState<CreateSessionData>({
    title: "",
    description: "",
    ownerId: "00000000-0000-0000-0000-000000000000", // Using placeholder ID for demo
    isPublic: true,
  });

  // Query to fetch sessions
  const { data: sessions, isLoading, isError, error } = useSessions();

  // Mutations for creating and deleting sessions
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSession.title.trim()) {
      createSessionMutation.mutate(newSession, {
        onSuccess: () => {
          // Reset form after successful creation
          setNewSession({
            title: "",
            description: "",
            ownerId: "00000000-0000-0000-0000-000000000000",
            isPublic: true,
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
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setNewSession({
      ...newSession,
      [name]: newValue,
    });
  };

  // Handle session deletion
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-4">Loading sessions...</div>;

  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load sessions"}
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Brainstorming Sessions</h2>

      {/* Create new session form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded-lg bg-gray-50"
      >
        <h3 className="text-xl font-semibold mb-3">Create New Session</h3>

        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newSession.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newSession.description || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={newSession.isPublic}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium">
              Make this session public
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={createSessionMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {createSessionMutation.isPending ? "Creating..." : "Create Session"}
        </button>
      </form>

      {/* Sessions list */}
      {sessions?.length === 0 ? (
        <p className="text-gray-500">
          No sessions found. Create your first one!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions?.map((session) => (
            <div
              key={session.id}
              className="border rounded-lg p-4 hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{session.title}</h3>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={deleteSessionMutation.isPending}
                >
                  Delete
                </button>
              </div>

              {session.description && (
                <p className="text-gray-600 mb-3">{session.description}</p>
              )}

              <div className="flex justify-between text-sm text-gray-500">
                <span>{session.isPublic ? "Public" : "Private"}</span>
                <span>Ideas: {session.ideas?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
