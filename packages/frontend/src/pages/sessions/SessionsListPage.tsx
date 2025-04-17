import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";
import {
  useGetSessions,
  useCreateSession,
  useDeleteSession,
} from "../../hooks/useSessions";
import { format } from "date-fns";
import Header from "../../components/layout/Header";

const SessionsListPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
  });

  // Fetch sessions using React Query
  const { data: sessions = [], isLoading, error, isError } = useGetSessions();

  // Create session mutation
  const createSession = useCreateSession({
    onSuccess: () => {
      console.log("createSession success");

      setFormData({ title: "", description: "", isPublic: true });
      setIsCreateModalOpen(false);
    },
  });

  // Delete session mutation
  const deleteSession = useDeleteSession({
    onSuccess: () => {
      setSelectedSessionId(null);
      setIsDeleteModalOpen(false);
    },
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Use a default owner ID for development/testing
    // In a real app, this would come from auth
    const ownerId = "00000000-0000-0000-0000-000000000000";

    createSession.mutate({
      ...formData,
      ownerId,
    });
  };

  const handleDeleteClick = (id: string) => {
    setSelectedSessionId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSessionId) {
      deleteSession.mutate(selectedSessionId);
    }
  };

  return (
    <>
      <Header title="Sessions" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sessions</h1>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Create Session
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {isError && (
          <Card className="bg-red-50 border border-red-200 mb-6">
            <div className="text-red-600">
              <p>Error loading sessions: {error?.message || "Unknown error"}</p>
            </div>
          </Card>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              No brainstorming sessions found.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Session
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card
              key={session.id}
              title={session.title}
              className="hover:shadow-md transition-shadow"
              footer={
                <div className="flex justify-between items-center w-full">
                  <Link
                    to={`/sessions/${session.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View Details
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(session.id)}
                  >
                    Delete
                  </Button>
                </div>
              }
            >
              <p className="text-gray-600 mb-2 line-clamp-2">
                {session.description}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mt-4">
                <span>{session.isPublic ? "Public" : "Private"}</span>
                <span>
                  {format(new Date(session.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Create Session Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Brainstorming Session"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSubmit}
                isLoading={createSession.isPending}
                disabled={!formData.title}
              >
                Create
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter session title"
              required
            />

            <div className="w-full">
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
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter session description"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPublic"
                className="ml-2 block text-sm text-gray-700"
              >
                Make this session public
              </label>
            </div>

            {createSession.isError && (
              <div className="text-red-600 text-sm">
                {createSession.error?.message ||
                  "An error occurred while creating the session"}
              </div>
            )}
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Session"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteSession.isPending}
              >
                Delete
              </Button>
            </>
          }
        >
          <p>
            Are you sure you want to delete this session? This action cannot be
            undone.
          </p>

          {deleteSession.isError && (
            <div className="mt-4 text-red-600 text-sm">
              {deleteSession.error?.message ||
                "An error occurred while deleting the session"}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default SessionsListPage;
