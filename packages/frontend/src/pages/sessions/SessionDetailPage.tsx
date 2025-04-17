import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";
import IdeasList from "../../components/ideas/IdeasList";
import {
  useGetSession,
  useUpdateSession,
  useDeleteSession,
} from "../../services/queries/useSessions";
import { format } from "date-fns";

const SessionDetailPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: true,
  });

  // Fetch session details
  const {
    data: session,
    isLoading,
    error,
    isError,
  } = useGetSession(sessionId || "", {
    enabled: !!sessionId,
  });

  // Update form data when session data is loaded
  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        description: session.description,
        isPublic: session.isPublic,
      });
    }
  }, [session]);

  // Update session mutation
  const updateSession = useUpdateSession({
    onSuccess: () => {
      setIsEditModalOpen(false);
    },
  });

  // Delete session mutation
  const deleteSession = useDeleteSession({
    onSuccess: () => {
      navigate("/sessions");
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId) {
      updateSession.mutate({
        id: sessionId,
        data: formData,
      });
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (sessionId) {
      deleteSession.mutate(sessionId);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !session) {
    return (
      <Layout>
        <div className="container mx-auto px-4">
          <Card className="bg-red-50 border border-red-200 mb-6">
            <div className="text-red-600">
              <p>
                Error loading session: {error?.message || "Session not found"}
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => navigate("/sessions")}
              >
                Return to Sessions
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {session.title}
            </h1>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(true)}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                }
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteClick}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Delete
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Description
              </h2>
              <p className="text-gray-600">
                {session.description || "No description provided."}
              </p>
            </div>

            <div className="flex justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mt-4">
              <div>
                <span className="font-medium">Status:</span>{" "}
                {session.isPublic ? "Public" : "Private"}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {format(new Date(session.createdAt), "MMM d, yyyy")}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {format(new Date(session.updatedAt), "MMM d, yyyy")}
              </div>
            </div>
          </Card>

          {/* Ideas List */}
          {sessionId && <IdeasList sessionId={sessionId} className="mb-6" />}

          {/* Edit Session Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Session"
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  isLoading={updateSession.isPending}
                  disabled={!formData.title}
                >
                  Save Changes
                </Button>
              </>
            }
          >
            <form onSubmit={handleEditSubmit} className="space-y-4">
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

              {updateSession.isError && (
                <div className="text-red-600 text-sm">
                  {updateSession.error?.message ||
                    "An error occurred while updating the session"}
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
              Are you sure you want to delete <strong>{session.title}</strong>?
              This action cannot be undone.
            </p>

            {deleteSession.isError && (
              <div className="mt-4 text-red-600 text-sm">
                {deleteSession.error?.message ||
                  "An error occurred while deleting the session"}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default SessionDetailPage;
