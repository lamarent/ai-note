import React, { useState } from "react";
import { useSessions, useCreateSession, useDeleteSession } from "../hooks";

interface SessionFormData {
  title: string;
  description: string;
  isPublic: boolean;
}

// Default development user ID (matching our seed data)
const DEFAULT_DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

export const SessionManager: React.FC = () => {
  const { data: sessions, isLoading, error } = useSessions();
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteSession();

  const [formData, setFormData] = useState<SessionFormData>({
    title: "",
    description: "",
    isPublic: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSessionMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        isPublic: formData.isPublic,
        ownerId: DEFAULT_DEV_USER_ID, // Using our default development user ID
      });

      // Reset form after successful creation
      setFormData({
        title: "",
        description: "",
        isPublic: false,
      });
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSessionMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete session:", err);
      }
    }
  };

  if (isLoading) return <div className="p-4">Loading sessions...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error:{" "}
        {error instanceof Error ? error.message : "Failed to load sessions"}
      </div>
    );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Create New Session</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white shadow rounded-lg p-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-700"
            >
              Make this session public
            </label>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">
              Using development user ID: {DEFAULT_DEV_USER_ID}
            </p>
            <button
              type="submit"
              disabled={createSessionMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {createSessionMutation.isPending
                ? "Creating..."
                : "Create Session"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Sessions</h2>
        {sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 bg-white shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{session.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                    {session.description && (
                      <p className="mt-2 text-gray-700">
                        {session.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {session.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteSessionMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No sessions found. Create your first session above!
          </p>
        )}
      </div>
    </div>
  );
};

export default SessionManager;
