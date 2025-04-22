import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import NewSessionStepper from "../../components/sessions/NewSessionStepper";
import { useGetSessions, useDeleteSession } from "../../hooks/useSessions";
import { format } from "date-fns";

const SessionsListPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  // Fetch sessions using React Query
  const { data: sessions = [], isLoading, error, isError } = useGetSessions();

  // Delete session mutation
  const deleteSession = useDeleteSession({
    onSuccess: () => {
      setSelectedSessionId(null);
      setIsDeleteModalOpen(false);
    },
  });

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
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sessions</h1>

          <Button
            onClick={() => setIsSidebarOpen(true)}
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
            <p className="mb-4">No brainstorming sessions found.</p>
            <Button onClick={() => setIsSidebarOpen(true)}>
              Create Your First Session
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link
              key={session.id}
              to={`/sessions/${session.id}`}
              className="block"
            >
              <Card
                title={session.title}
                className="hover:shadow-md transition-shadow cursor-pointer"
                footer={
                  <div className="flex justify-end w-full">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(session.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                }
              >
                <p className="mb-2 line-clamp-2">{session.description}</p>
                <div className="flex justify-between text-sm mt-4">
                  <span>{session.isPublic ? "Public" : "Private"}</span>
                  <span>
                    {format(new Date(session.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sidebar for Create Session */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
            <div className="w-full max-w-1/2 bg-base-300 p-6 overflow-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Session</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <NewSessionStepper />
            </div>
          </div>
        )}

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
