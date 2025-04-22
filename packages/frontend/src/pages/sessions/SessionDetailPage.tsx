import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Header from "../../components/layout/Header"; // Removed unused import
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import Input from "../../components/forms/Input";
import IdeasList from "../../components/ideas/IdeasList";
// import AIGenerationPanel from "../../components/ideas/AIGenerationPanel";
import AIToolsPanel from "../../components/ai/AIToolsPanel";
import ExportPanel from "../../components/sessions/ExportPanel";
import {
  useGetSessionById,
  useUpdateSession,
  useDeleteSession,
  useGetIdeasBySession,
  useUpdateIdea,
} from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Idea } from "@ai-brainstorm/types";
import { format } from "date-fns";
import {
  getApiKeyEntries,
  getActiveEntryId,
  saveActiveEntryId,
} from "../../utils/localStorage";
import type { ApiKeyEntry } from "../../types/apiKey";

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
    <h1 className="text-2xl font-bold">{title}</h1>
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
      <h2 className="text-lg font-medium mb-2">Description</h2>
      <p>{description || "No description provided."}</p>
    </div>
    <div className="flex justify-between text-sm opacity-70 border-t border-base-300 pt-4 mt-4">
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
  const [selectedIdea, setSelectedIdea] = useState<Idea | undefined>(undefined);
  // API key override state
  const [entries, setEntries] = useState<ApiKeyEntry[]>([]);
  const [overrideEntryId, setOverrideEntryId] = useState<string | null>(null);

  // Fetch session details
  const {
    data: session,
    isLoading: isSessionLoading,
    error: sessionError,
    isError: isSessionError,
  } = useGetSessionById(sessionId || "");

  // Load API key entries and current override on mount
  useEffect(() => {
    setEntries(getApiKeyEntries());
    setOverrideEntryId(getActiveEntryId());
  }, []);

  // Fetch ideas for this session (to provide for AI expansion and selection)
  const { data: ideas = [], isLoading: isIdeasLoading } = useGetIdeasBySession(
    sessionId || ""
  );

  // Tab state for switching panels
  const [activeTab, setActiveTab] = useState<"ideas" | "ai" | "export">(
    "ideas"
  );

  // Query client for refetching ideas list
  const queryClient = useQueryClient();

  // Update mutation for AI-refined ideas
  const updateIdea = useUpdateIdea();

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

  // Handle idea selection for AI operations
  const handleIdeaSelect = (idea: Idea) => {
    setSelectedIdea(idea);
    // If we're not already on the AI tab, switch to it
    if (activeTab !== "ai") {
      setActiveTab("ai");
    }
  };

  // Handler for AI-generated ideas: invalidate ideas list to fetch newly saved ideas
  const handleIdeasGenerated = () => {
    if (!sessionId) return;
    queryClient.invalidateQueries({
      queryKey: ["ideas", "list", { sessionId }] as const,
    });
  };

  // Handler for AI-refined idea
  const handleIdeaRefined = (refinedIdea: Idea) => {
    if (!sessionId || !selectedIdea) return;

    // Update the selected idea with the refined content
    updateIdea.mutate({
      id: selectedIdea.id,
      data: {
        content: refinedIdea.content,
        isAiGenerated: true,
      },
    });

    // Clear the selection after refining
    setSelectedIdea(undefined);
  };

  if (isSessionLoading || isIdeasLoading) {
    return (
      <>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </>
    );
  }

  if (isSessionError || !session) {
    const errorMessage =
      sessionError instanceof Error
        ? sessionError.message
        : "Session not found or unknown error";
    return (
      <>
        <div className="container mx-auto px-4 py-6">
          <Card className="alert alert-error mb-6">
            <div>
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
          <div className="tabs tabs-bordered mb-6" role="tablist">
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
              AI Assistance
            </button>
            <button
              className={`tab ${activeTab === "export" ? "tab-active" : ""}`}
              role="tab"
              aria-selected={activeTab === "export"}
              aria-controls="export-panel"
              onClick={() => setActiveTab("export")}
            >
              Export
            </button>
          </div>
          {/* Panel content */}
          {activeTab === "ideas" && (
            <div id="ideas-panel" role="tabpanel">
              <div className="mb-6">
                {/* Pass onIdeaSelect to IdeasList */}
                <IdeasList
                  sessionId={session.id}
                  onIdeaSelect={handleIdeaSelect}
                />
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div id="ai-panel" role="tabpanel" className="mb-6">
              {/* API Key Override Dropdown */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">API Key Override</span>
                </label>
                <select
                  value={overrideEntryId || ""}
                  onFocus={() => setEntries(getApiKeyEntries())}
                  onChange={(e) => {
                    const newId = e.target.value;
                    saveActiveEntryId(newId);
                    setOverrideEntryId(newId);
                  }}
                  className="select select-bordered w-full"
                >
                  <option value="">Use Default</option>
                  {entries.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.provider} | {entry.model} | ****
                      {entry.key.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>
              <AIToolsPanel
                sessionId={session.id}
                selectedIdea={selectedIdea}
                onIdeasGenerated={handleIdeasGenerated}
                onIdeaRefined={handleIdeaRefined}
              />
            </div>
          )}

          {activeTab === "export" && (
            <div id="export-panel" role="tabpanel" className="mb-6">
              <ExportPanel session={session} ideas={ideas} />
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
                  className="block text-sm font-medium mb-1"
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
                  className="textarea textarea-bordered w-full"
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
                  className="checkbox"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm">
                  Make this session public
                </label>
              </div>

              {updateSession.isError && (
                <div className="text-error text-sm">
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
              Are you sure you want to delete this session? This will also
              delete all ideas associated with it. This action cannot be undone.
            </p>
            {deleteSession.isError && (
              <div className="mt-4 text-error text-sm">
                {deleteSession.error?.message}
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default SessionDetailPage;
