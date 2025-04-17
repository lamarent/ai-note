import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSession,
  useGetSessionIdeas,
  useGetCategories,
  useCreateIdea,
  useUpdateIdea,
  useDeleteIdea,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../api/hooks";
// Import DndKit components and hooks
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy, // Using vertical list for now, can adapt later
  rectSortingStrategy, // Strategy for grid layout
} from "@dnd-kit/sortable";
// Import CSS from utilities
import { CSS } from "@dnd-kit/utilities";
import Button from "../common/Button";
// Import standardized types from api/*Api.ts files (adjust path if index.ts is used)
import { Session } from "../../api/sessionApi";
import {
  Idea,
  CreateIdeaData,
  UpdateIdeaData,
  Position,
} from "../../api/ideaApi";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "../../api/categoryApi";
import Modal from "../common/Modal";

// Local form state can use Partial of the create/update types
// type CategoryFormData = Partial<CreateCategoryData>; // Example
// type IdeaFormData = Partial<CreateIdeaData>; // Example

// Color mapping remains useful for UI
const COLOR_MAP: Record<string, string> = {
  red: "error",
  blue: "primary",
  green: "success",
  yellow: "warning",
  purple: "accent",
  teal: "info",
  pink: "secondary",
  orange: "warning",
};
const COLORS = Object.entries(COLOR_MAP).map(([name, value]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  value: name,
  daisyClass: value,
}));

// Helper function to get default position (might need adjustment for DnD)
const getDefaultPosition = (index: number, ideas: Idea[] = []): Position => {
  // Find max Y position to place new items below existing ones
  const maxY = ideas.reduce(
    (max, idea) => Math.max(max, idea.position?.y || 0),
    0
  );
  // Simple placement logic for now, adjust as needed
  const col = index % 3; // Example: 3 columns
  return { x: 50 + col * 320, y: maxY + 150 }; // Add below the max Y
};

// Sortable Idea Item Component
interface SortableIdeaProps {
  idea: Idea;
  sessionCategories: Category[];
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

function SortableIdea({
  idea,
  sessionCategories,
  onEdit,
  onDelete,
}: SortableIdeaProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: idea.id });

  // Explicitly type style as React.CSSProperties
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined, // Bring dragging item to front
    opacity: isDragging ? 0.8 : 1,
    position: "relative", // Needed for zIndex to work
  };

  // Find category details
  const category = sessionCategories.find((c) => c.id === idea.categoryId);
  const categoryColor = category?.color || "neutral";
  const categoryBgClass = category
    ? `bg-${COLOR_MAP[categoryColor] || "base"}-100`
    : "bg-base-200";
  const categoryBorderClass = category
    ? `border-${COLOR_MAP[categoryColor] || "base"}-300`
    : "border-base-300";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card ${categoryBgClass} border ${categoryBorderClass} shadow-sm`}
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
          <span>Added {new Date(idea.createdAt).toLocaleDateString()}</span>
          <div className="flex space-x-1">
            {/* Disable edit/delete while dragging? Maybe not needed */}
            <Button
              size="xs"
              ghost
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag start on button click
                onEdit(idea);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              ghost
              className="text-error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const EnhancedSessionPage: React.FC = () => {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Hooks now return standardized types
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useGetSession(sessionId);
  const { data: ideas = [], isLoading: ideasLoading } =
    useGetSessionIdeas(sessionId);
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategories();

  // Mutations
  const createIdeaMutation = useCreateIdea();
  const updateIdeaMutation = useUpdateIdea();
  const deleteIdeaMutation = useDeleteIdea();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Local state for forms - use Partial<Create...>
  const [ideaFormData, setIdeaFormData] = useState<Partial<CreateIdeaData>>({
    content: "",
    categoryId: undefined,
  });
  const [categoryFormData, setCategoryFormData] = useState<
    Partial<CreateCategoryData>
  >({ name: "", color: "blue" });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  // Use Partial<Update...> for edit state
  const [editingIdeaData, setEditingIdeaData] = useState<
    Partial<UpdateIdeaData>
  >({ content: "", categoryId: undefined, position: undefined });
  const [showIdeaModal, setShowIdeaModal] = useState(false);

  // Filter categories using standardized Category type with sessionId
  const sessionCategories: Category[] =
    categories?.filter(
      (category: Category) => category.sessionId === sessionId
    ) || [];

  // --- DndKit Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    if (!ideaFormData.content?.trim()) return;
    try {
      const position = getDefaultPosition(ideas.length, ideas);
      // CreateIdeaData requires createdBy, ensure all required fields are present
      const ideaPayload: CreateIdeaData = {
        content: ideaFormData.content,
        sessionId,
        categoryId: ideaFormData.categoryId,
        position: position,
        createdBy: "00000000-0000-0000-0000-000000000000", // Placeholder
      };
      await createIdeaMutation.mutateAsync(ideaPayload);
      setIdeaFormData({ content: "", categoryId: undefined }); // Reset form
    } catch (error) {
      console.error("Failed to create idea:", error);
    }
  };

  const handleCategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name?.trim() || !categoryFormData.color) return;
    try {
      if (editingCategoryId) {
        // UpdateCategoryData has optional fields
        const updatePayload: UpdateCategoryData = {
          name: categoryFormData.name,
          color: categoryFormData.color,
        };
        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          data: updatePayload,
        });
      } else {
        // CreateCategoryData requires name, color, sessionId
        const createPayload: CreateCategoryData = {
          name: categoryFormData.name,
          color: categoryFormData.color,
          sessionId: sessionId,
        };
        await createCategoryMutation.mutateAsync(createPayload);
      }
      setCategoryFormData({ name: "", color: "blue" }); // Reset form
      setShowCategoryModal(false);
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Category type from categoryApi.ts has color
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

  // Idea type from ideaApi.ts has categoryId
  const handleEditIdeaClick = (idea: Idea) => {
    setEditingIdeaId(idea.id);
    setEditingIdeaData({
      content: idea.content,
      categoryId: idea.categoryId,
      position: idea.position, // Load position into edit form
    });
    setShowIdeaModal(true);
  };

  const handleUpdateIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIdeaId || !editingIdeaData.content?.trim()) return;
    try {
      // Ensure position is included in the update payload
      const updatePayload: UpdateIdeaData = {
        content: editingIdeaData.content,
        categoryId: editingIdeaData.categoryId,
        position: editingIdeaData.position, // Send updated position
      };
      await updateIdeaMutation.mutateAsync({
        id: editingIdeaId,
        data: updatePayload,
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

  // --- Drag and Drop Handler ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIdea = ideas.find((idea) => idea.id === active.id);
      const overIdea = ideas.find((idea) => idea.id === over.id); // The idea being dropped onto

      if (!activeIdea || !over) return; // Should not happen if IDs are correct

      // Calculate new position based on drag event delta
      // Note: event.delta gives the pixel difference moved
      // We need to update the idea's absolute position property
      const newPosition: Position = {
        x: (activeIdea.position?.x || 0) + event.delta.x,
        y: (activeIdea.position?.y || 0) + event.delta.y,
      };

      // Basic validation: ensure position is not negative
      newPosition.x = Math.max(0, newPosition.x);
      newPosition.y = Math.max(0, newPosition.y);

      // Call mutation to update the position in the backend
      updateIdeaMutation.mutate(
        {
          id: active.id as string,
          data: { position: newPosition }, // Only update position
        },
        {
          onError: (error) => {
            console.error("Failed to update idea position:", error);
            // Optional: Revert optimistic update if implemented
          },
          // Note: onSuccess invalidation is handled by the hook itself
        }
      );

      // Optimistic UI update (or rely on query invalidation)
      // For simplicity, we rely on the hook's onSuccess invalidation for now.
      // If optimistic updates are needed later:
      // const oldIndex = ideas.findIndex(idea => idea.id === active.id);
      // const newIndex = ideas.findIndex(idea => idea.id === over.id);
      // const movedIdeas = arrayMove(ideas, oldIndex, newIndex);
      // queryClient.setQueryData(IDEA_KEYS.bySession(sessionId), movedIdeas); // Example
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

      {/* Session header - Use standardized Session type */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            {/* Access session.title and session.isPublic */}
            <h1 className="card-title text-3xl">{session?.title}</h1>
            {session && (
              <div
                className={`badge badge-lg ${session.isPublic ? "badge-success" : "badge-neutral"}`}
              >
                {session.isPublic ? "Public" : "Private"}
              </div>
            )}
          </div>
          {session?.description && (
            <p className="text-base-content/80 mb-4">{session.description}</p>
          )}
          <div className="text-sm text-base-content/70">
            Created on{" "}
            {session ? new Date(session.createdAt).toLocaleDateString() : "..."}
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
                  value={ideaFormData.content || ""}
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
                    createIdeaMutation.isPending ||
                    !ideaFormData.content?.trim()
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

              {/* Categories list - Use standardized Category type */}
              <div className="space-y-2 mt-4">
                {sessionCategories.length === 0 ? (
                  <p className="text-base-content/70 text-sm italic">
                    No categories yet.
                  </p>
                ) : (
                  sessionCategories.map(
                    (
                      category: Category // Explicit type
                    ) => (
                      <div
                        key={category.id}
                        className={`flex items-center justify-between p-2 rounded-md border border-base-300`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Access category.color */}
                          <div
                            className={`w-3 h-3 rounded-full bg-${COLOR_MAP[category.color] || "neutral"}-500`}
                          ></div>{" "}
                          {/* Added -500 for actual color */}
                          <span className="text-sm font-medium">
                            {category.name}
                          </span>
                        </div>
                        {/* ... (Edit/Delete buttons) ... */}
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Ideas display - Card */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Ideas ({ideas?.length || 0})</h2>

            {/* Ideas list - Wrapped with DndContext */}
            {!ideas || ideas.length === 0 ? (
              <p className="text-base-content/70 italic">
                No ideas yet. Add your first idea using the form.
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={ideas.map((idea) => idea.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 relative">
                    {ideas.map((idea) => (
                      <SortableIdea
                        key={idea.id}
                        idea={idea}
                        sessionCategories={sessionCategories}
                        onEdit={handleEditIdeaClick}
                        onDelete={handleDeleteIdeaClick}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Use standardized types */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title={editingCategoryId ? "Edit Category" : "Create Category"}
      >
        {/* Use categoryFormData.name, categoryFormData.color */}
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
              value={categoryFormData.name || ""} // Handle potential undefined
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
                !categoryFormData.name?.trim()
              }
            >
              {editingCategoryId ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showIdeaModal}
        onClose={() => setShowIdeaModal(false)}
        title="Edit Idea"
      >
        {/* Use editingIdeaData.content, editingIdeaData.categoryId */}
        <form onSubmit={handleUpdateIdeaSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="editContent" className="label">
              <span className="label-text">Idea Content</span>
            </label>
            <textarea
              id="editContent"
              className="textarea textarea-bordered"
              rows={4}
              value={editingIdeaData.content || ""} // Handle potential undefined
              onChange={(e) =>
                setEditingIdeaData({
                  ...editingIdeaData,
                  content: e.target.value,
                })
              }
              required
            />
          </div>
          {/* Re-enable category selection */}
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
          {/* Optional: Display/Edit Position */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Position (Readonly)</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm"
              readOnly
              value={`X: ${editingIdeaData.position?.x ?? "N/A"}, Y: ${editingIdeaData.position?.y ?? "N/A"}`}
            />
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
                updateIdeaMutation.isPending || !editingIdeaData.content?.trim()
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
