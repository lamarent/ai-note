import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";
import IdeasList from "../../components/ideas/IdeasList";
import {
  useGetSessionById,
  useUpdateSession,
  useDeleteSession,
} from "../../hooks/useSessions";
import { format } from "date-fns";

// Extracted SessionHeader component to simplify header rendering
interface SessionHeaderProps {
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}
const SessionHeader: React.FC<SessionHeaderProps> = ({
  title,
  onEdit,
  onDelete,
}) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex space-x-2">
      <Button variant="secondary" onClick={onEdit} aria-label="Edit session">
        Edit
      </Button>
      <Button variant="danger" onClick={onDelete} aria-label="Delete session">
        Delete
      </Button>
    </div>
  </div>
);

// Extracted SessionMetadata component to focus on description and dates
interface SessionMetadataProps {
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const SessionMetadata: React.FC<SessionMetadataProps> = ({
  description,
  isPublic,
  createdAt,
  updatedAt,
}) => (
  <Card className="mb-6">
    <div className="mb-4">
      <h2 className="text-lg font-medium text-gray-700 mb-2">Description</h2>
      <p className="text-gray-600">
        {description || "No description provided."}
      </p>
    </div>
    <div className="flex justify-between text-sm text-gray-500 border-t border-gray-200 pt-4 mt-4">
      <div>
        <span className="font-medium">Status:</span>{" "}
        {isPublic ? "Public" : "Private"}
      </div>
      <div>
        <span className="font-medium">Created:</span>{" "}
        {format(createdAt, "MMM d, yyyy")}
      </div>
      <div>
        <span className="font-medium">Last Updated:</span>{" "}
        {format(updatedAt, "MMM d, yyyy")}
      </div>
    </div>
  </Card>
);

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
  } = useGetSessionById(sessionId || "");

  // Tab state for switching panels
  const [activeTab, setActiveTab] = useState<"ideas" | "ai">("ideas");

  // Update form data when session data is loaded
  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        description: session.description ?? "",
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
      <>
        <Header title="Loading Session..." />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !session) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Session not found or unknown error";
    return (
      <>
        <Header title="Error" />
        <div className="container mx-auto px-4 py-6">
          <Card className="bg-red-50 border border-red-200 mb-6">
            <div className="text-red-600">
              <p>Error loading session: {errorMessage}</p>
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
      </>
    );
  }

  return (
    <>
      <Header title={session.title || "Session Detail"} />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <SessionHeader
            title={session.title}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDeleteClick}
          />
          <SessionMetadata
            description={session.description}
            isPublic={session.isPublic}
            createdAt={new Date(session.createdAt)}
            updatedAt={new Date(session.updatedAt)}
          />
          {/* Tabs for navigation */}
          <div className="tabs mb-6" role="tablist">
            <button
              className={`tab ${activeTab === "ideas" ? "tab-active" : ""}`}
              role="tab"
              aria-selected={activeTab === "ideas"}
              aria-controls="ideas-panel"
              onClick={() => setActiveTab("ideas")}
            >
              Ideas
            </button>
            <button
              className={`tab ${activeTab === "ai" ? "tab-active" : ""}`}
              role="tab"
              aria-selected={activeTab === "ai"}
              aria-controls="ai-panel"
              onClick={() => setActiveTab("ai")}
            >
              AI Suggestions
            </button>
          </div>
          {/* Panel content */}
          {activeTab === "ideas" ? (
            <div id="ideas-panel" role="tabpanel">
              <div className="mb-6">
                <IdeasList sessionId={session.id} />
              </div>
            </div>
          ) : (
            <div id="ai-panel" role="tabpanel" className="mb-6">
              {/* Placeholder for AI-powered idea suggestions */}
              <p className="text-gray-600 italic">
                AI-powered suggestions will appear here.
              </p>
            </div>
          )}

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
    </>
  );
};

export default SessionDetailPage;
