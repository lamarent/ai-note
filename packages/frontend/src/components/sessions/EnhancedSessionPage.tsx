import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useSession,
  useSessionIdeas,
  useCategories,
  useCreateIdea,
  useUpdateIdea,
  useDeleteIdea,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks"; // Assuming hooks index
import Button from "../common/Button"; // Import Button
import { Idea, Category } from "../../api/types"; // Assuming types exist
import Modal from "../common/Modal"; // Import Modal for confirmations/editing

// Define interfaces locally if not imported
interface CategoryFormData {
  name: string;
  color: string; // Keep color for now, map to DaisyUI colors later
}

interface IdeaFormData {
  content: string;
  categoryId?: string;
}

interface Position {
  x: number;
  y: number;
}

// Map string colors to DaisyUI theme colors or keep as class names
const COLOR_MAP: Record<string, string> = {
  red: "error",
  blue: "primary",
  green: "success",
  yellow: "warning",
  purple: "accent",
  teal: "info",
  pink: "secondary", // Example mapping
  orange: "warning", // Example mapping
};

const COLORS = Object.entries(COLOR_MAP).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  value: name,
  daisyClass: value,
}));

const getDefaultPosition = (index: number): Position => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: 100 + col * 300, y: 100 + row * 150 };
};

const EnhancedSessionPage: React.FC = () => {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Fetch data
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useSession(sessionId);
  const { data: ideas, isLoading: ideasLoading } = useSessionIdeas(sessionId);
  const { data: categories, isLoading: categoriesLoading } =
    useCategories(sessionId); // Assuming hook can take sessionId

  // Mutations
  const createIdeaMutation = useCreateIdea();
  // Need to pass ID dynamically to update/delete mutations, often done via wrapper fn
  const updateIdeaMutation = useUpdateIdea();
  const deleteIdeaMutation = useDeleteIdea();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Local state
  const [ideaFormData, setIdeaFormData] = useState<IdeaFormData>({
    content: "",
    categoryId: undefined,
  });
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: "",
    color: "blue",
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editingIdeaData, setEditingIdeaData] = useState<IdeaFormData>({
    content: "",
    categoryId: undefined,
  });
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  // Filter categories (assuming categories might contain others if not filtered by hook)
  const sessionCategories =
    categories?.filter((category) => category.sessionId === sessionId) || [];

  // Loading state
  if (sessionLoading || ideasLoading || categoriesLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center p-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <span className="ml-3 text-lg">Loading session data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (sessionError) {
    return (
      <div className="container mx-auto p-4">
        <div role="alert" className="alert alert-error shadow-md">
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
            {sessionError instanceof Error
              ? sessionError.message
              : "Error loading session"}
          </span>
        </div>
        <Button variant="link" onClick={() => navigate("/")} className="mt-4">
          &larr; Back to sessions
        </Button>
      </div>
    );
  }

  // Session not found
  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <div role="alert" className="alert alert-warning shadow-md">
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
        <Button variant="link" onClick={() => navigate("/")} className="mt-4">
          &larr; Back to sessions
        </Button>
      </div>
    );
  }

  // --- Handlers ---

  const handleCreateIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaFormData.content.trim()) return;
    try {
      const position = getDefaultPosition(ideas?.length || 0);
      await createIdeaMutation.mutateAsync({
        content: ideaFormData.content,
        sessionId,
        categoryId: ideaFormData.categoryId,
        position: position, // Pass Position object if API expects it
      });
      setIdeaFormData({ content: "", categoryId: undefined });
    } catch (error) {
      console.error("Failed to create idea:", error);
    }
  };

  const handleCategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;
    try {
      const mutationData = {
        id: editingCategoryId, // Will be null for creation
        name: categoryFormData.name,
        color: categoryFormData.color,
        sessionId: sessionId, // Needed for creation/update validation
      };
      if (editingCategoryId) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          data: mutationData,
        });
      } else {
        await createCategoryMutation.mutateAsync(mutationData);
      }
      setCategoryFormData({ name: "", color: "blue" });
      setShowCategoryModal(false);
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryFormData({ name: category.name, color: category.color });
    setShowCategoryModal(true);
  };

  const handleDeleteCategoryClick = async (categoryId: string) => {
    // Use Modal for confirmation later
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleEditIdeaClick = (idea: Idea) => {
    setEditingIdeaId(idea.id);
    setEditingIdeaData({ content: idea.content, categoryId: idea.categoryId });
    setShowIdeaModal(true);
  };

  const handleUpdateIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdeaId || !editingIdeaData.content.trim()) return;
    try {
      await updateIdeaMutation.mutateAsync({
        id: editingIdeaId,
        data: editingIdeaData,
      });
      setShowIdeaModal(false);
      setEditingIdeaId(null);
    } catch (error) {
      console.error("Failed to update idea:", error);
    }
  };

  const handleDeleteIdeaClick = async (ideaId: string) => {
    // Use Modal for confirmation later
    if (window.confirm("Are you sure you want to delete this idea?")) {
      try {
        await deleteIdeaMutation.mutateAsync(ideaId);
      } catch (error) {
        console.error("Failed to delete idea:", error);
      }
    }
  };

  // --- Render ---

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Navigation */}
      <div>
        <Button variant="link" onClick={() => navigate("/")}>
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to sessions
        </Button>
      </div>

      {/* Session header - Use DaisyUI Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <h1 className="card-title text-3xl">{session.title}</h1>
            <div className="badge badge-lg {session.isPublic ? 'badge-success' : 'badge-neutral'}">
              {session.isPublic ? "Public" : "Private"}
            </div>
          </div>
          {session.description && (
            <p className="text-base-content/80 mb-4">{session.description}</p>
          )}
          <div className="text-sm text-base-content/70">
            Created on {new Date(session.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Idea Form - Card */}
          <div className="card bg-base-100 shadow-xl">
            <form onSubmit={handleCreateIdeaSubmit} className="card-body">
              <h2 className="card-title">Add New Idea</h2>
              <div className="form-control">
                <label htmlFor="content" className="label">
                  <span className="label-text">Idea Content</span>
                </label>
                <textarea
                  id="content"
                  rows={3}
                  className="textarea textarea-bordered"
                  placeholder="Write your idea here..."
                  value={ideaFormData.content}
                  onChange={(e) =>
                    setIdeaFormData({
                      ...ideaFormData,
                      content: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label htmlFor="categoryId" className="label">
                  <span className="label-text">Category (Optional)</span>
                </label>
                <select
                  id="categoryId"
                  className="select select-bordered"
                  value={ideaFormData.categoryId || ""}
                  onChange={(e) =>
                    setIdeaFormData({
                      ...ideaFormData,
                      categoryId: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">No Category</option>
                  {sessionCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="card-actions justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createIdeaMutation.isPending}
                  disabled={
                    createIdeaMutation.isPending || !ideaFormData.content.trim()
                  }
                >
                  Add Idea
                </Button>
              </div>
            </form>
          </div>

          {/* Categories Management - Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="card-actions justify-between items-center">
                <h2 className="card-title">Categories</h2>
                <Button
                  variant="primary"
                  ghost
                  size="sm"
                  onClick={() => {
                    setCategoryFormData({ name: "", color: "blue" });
                    setEditingCategoryId(null);
                    setShowCategoryModal(true); // Open modal instead of inline form
                  }}
                >
                  Add Category
                </Button>
              </div>

              {/* Categories list */}
              <div className="space-y-2 mt-4">
                {sessionCategories.length === 0 ? (
                  <p className="text-base-content/70 text-sm italic">
                    No categories yet.
                  </p>
                ) : (
                  sessionCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-2 rounded-md border border-base-300`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-${COLOR_MAP[category.color] || "neutral"}`}
                        ></div>{" "}
                        {/* Use mapped color */}
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="xs"
                          ghost
                          onClick={() => handleEditCategoryClick(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          ghost
                          className="text-error"
                          onClick={() => handleDeleteCategoryClick(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Ideas display - Card */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Ideas ({ideas?.length || 0})</h2>

            {/* Ideas list */}
            {!ideas || ideas.length === 0 ? (
              <p className="text-base-content/70 italic">
                No ideas yet. Add your first idea using the form.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {ideas.map((idea: Idea) => {
                  // Type hint
                  const category = sessionCategories.find(
                    (c) => c.id === idea.categoryId
                  );
                  const categoryColorClass = category
                    ? `bg-${COLOR_MAP[category.color] || "neutral"}`
                    : "bg-base-200";
                  const categoryBorderClass = category
                    ? `border-${COLOR_MAP[category.color] || "neutral"}`
                    : "border-base-300";
                  const categoryTextColorClass = category
                    ? `text-${COLOR_MAP[category.color] || "neutral"}-content`
                    : "text-base-content";

                  return (
                    // Use card for each idea
                    <div
                      key={idea.id}
                      className={`card ${categoryColorClass} bg-opacity-10 border ${categoryBorderClass} shadow-sm`}
                    >
                      <div className="card-body p-4">
                        {category && (
                          <div
                            className={`badge badge-sm badge-${COLOR_MAP[category.color] || "neutral"} mb-2`}
                          >
                            {category.name}
                          </div>
                        )}
                        <p className="mb-3 text-base-content whitespace-pre-wrap">
                          {idea.content}
                        </p>
                        <div className="card-actions justify-between items-center text-sm text-base-content/70">
                          <span>
                            Added{" "}
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              size="xs"
                              ghost
                              onClick={() => handleEditIdeaClick(idea)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              ghost
                              className="text-error"
                              onClick={() => handleDeleteIdeaClick(idea.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Category Form Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategoryId ? "Edit Category" : "Create Category"}
      >
        <form onSubmit={handleCategoryFormSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="categoryName" className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              id="categoryName"
              className="input input-bordered"
              placeholder="Category name"
              value={categoryFormData.name}
              onChange={(e) =>
                setCategoryFormData({
                  ...categoryFormData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Color</span>
            </label>
            {/* Use radio buttons for color selection */}
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <label key={color.value} className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    name="categoryColor"
                    className={`radio radio-${color.daisyClass}`}
                    value={color.value}
                    checked={categoryFormData.color === color.value}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        color: e.target.value,
                      })
                    }
                  />
                  <span className={`badge badge-${color.daisyClass}`}>
                    {color.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending
              }
              disabled={
                createCategoryMutation.isPending ||
                updateCategoryMutation.isPending ||
                !categoryFormData.name.trim()
              }
            >
              {editingCategoryId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Idea Modal */}
      <Modal
        isOpen={showIdeaModal}
        onClose={() => setShowIdeaModal(false)}
        title="Edit Idea"
      >
        <form onSubmit={handleUpdateIdeaSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="editContent" className="label">
              <span className="label-text">Idea Content</span>
            </label>
            <textarea
              id="editContent"
              className="textarea textarea-bordered"
              rows={4}
              value={editingIdeaData.content}
              onChange={(e) =>
                setEditingIdeaData({
                  ...editingIdeaData,
                  content: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="editCategoryId" className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              id="editCategoryId"
              className="select select-bordered"
              value={editingIdeaData.categoryId || ""}
              onChange={(e) =>
                setEditingIdeaData({
                  ...editingIdeaData,
                  categoryId: e.target.value || undefined,
                })
              }
            >
              <option value="">No Category</option>
              {sessionCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowIdeaModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={updateIdeaMutation.isPending}
              disabled={
                updateIdeaMutation.isPending || !editingIdeaData.content.trim()
              }
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EnhancedSessionPage;
