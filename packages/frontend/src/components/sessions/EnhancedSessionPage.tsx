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
} from "../hooks";

interface CategoryFormData {
  name: string;
  color: string;
}

interface IdeaFormData {
  content: string;
  categoryId?: string;
}

interface Position {
  x: number;
  y: number;
}

// Available colors for categories
const COLORS = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Teal", value: "teal" },
  { name: "Pink", value: "pink" },
  { name: "Orange", value: "orange" },
];

// Default positions for new ideas (grid-like layout)
const getDefaultPosition = (index: number): Position => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  return { x: 100 + col * 300, y: 100 + row * 150 };
};

const EnhancedSessionPage: React.FC = () => {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Fetch session data
  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useSession(sessionId);

  // Fetch ideas for this session
  const { data: ideas, isLoading: ideasLoading } = useSessionIdeas(sessionId);

  // Fetch categories for this session
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Mutations
  const createIdeaMutation = useCreateIdea();
  const updateIdeaMutation = useUpdateIdea("");
  const deleteIdeaMutation = useDeleteIdea();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory("");
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
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editingIdeaData, setEditingIdeaData] = useState<IdeaFormData>({
    content: "",
    categoryId: undefined,
  });

  // Filter categories to show only those for this session
  const sessionCategories =
    categories?.filter((category) => category.sessionId === sessionId) || [];

  // Loading state
  if (sessionLoading || ideasLoading || categoriesLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading session data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (sessionError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {sessionError instanceof Error
            ? sessionError.message
            : "Error loading session"}
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back to sessions
        </button>
      </div>
    );
  }

  // Session not found
  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">Session not found</div>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700"
        >
          &larr; Back to sessions
        </button>
      </div>
    );
  }

  // Handler for creating a new idea
  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ideaFormData.content.trim()) return;

    try {
      // Calculate position based on existing ideas count
      const position = getDefaultPosition(ideas?.length || 0);

      await createIdeaMutation.mutateAsync({
        content: ideaFormData.content,
        sessionId,
        categoryId: ideaFormData.categoryId,
        position: JSON.stringify(position),
      });

      // Reset form
      setIdeaFormData({
        content: "",
        categoryId: undefined,
      });
    } catch (error) {
      console.error("Failed to create idea:", error);
    }
  };

  // Handler for creating a new category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryFormData.name.trim()) return;

    try {
      if (editingCategoryId) {
        // Update existing category
        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          name: categoryFormData.name,
          color: categoryFormData.color,
        });
      } else {
        // Create new category
        await createCategoryMutation.mutateAsync({
          name: categoryFormData.name,
          color: categoryFormData.color,
          sessionId,
        });
      }

      // Reset form
      setCategoryFormData({
        name: "",
        color: "blue",
      });
      setShowCategoryForm(false);
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  // Handler for editing an idea
  const handleEditIdea = (idea: any) => {
    setEditingIdeaId(idea.id);
    setEditingIdeaData({
      content: idea.content,
      categoryId: idea.categoryId,
    });
  };

  // Handler for updating an idea
  const handleUpdateIdea = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingIdeaId || !editingIdeaData.content.trim()) return;

    try {
      await updateIdeaMutation.mutateAsync({
        id: editingIdeaId,
        content: editingIdeaData.content,
        categoryId: editingIdeaData.categoryId,
      });

      // Reset editing state
      setEditingIdeaId(null);
      setEditingIdeaData({
        content: "",
        categoryId: undefined,
      });
    } catch (error) {
      console.error("Failed to update idea:", error);
    }
  };

  // Handler for deleting an idea
  const handleDeleteIdea = async (ideaId: string) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;

    try {
      await deleteIdeaMutation.mutateAsync(ideaId);
    } catch (error) {
      console.error("Failed to delete idea:", error);
    }
  };

  // Handler for deleting a category
  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? Ideas will be uncategorized."
      )
    )
      return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Handler for editing a category
  const handleEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setCategoryFormData({
      name: category.name,
      color: category.color,
    });
    setShowCategoryForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
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
        </button>
      </div>

      {/* Session header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
        {session.description && (
          <p className="text-gray-600 mb-4">{session.description}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Created on {new Date(session.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Create idea form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Idea</h2>
            <form onSubmit={handleCreateIdea}>
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Idea Content
                </label>
                <textarea
                  id="content"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="categoryId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={
                    createIdeaMutation.isPending || !ideaFormData.content.trim()
                  }
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {createIdeaMutation.isPending ? "Adding..." : "Add Idea"}
                </button>
              </div>
            </form>
          </div>

          {/* Categories management */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Categories</h2>
              <button
                onClick={() => {
                  setCategoryFormData({ name: "", color: "blue" });
                  setEditingCategoryId(null);
                  setShowCategoryForm(!showCategoryForm);
                }}
                className="inline-flex items-center py-1 px-3 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {showCategoryForm ? "Cancel" : "Add Category"}
              </button>
            </div>

            {showCategoryForm && (
              <form
                onSubmit={handleCreateCategory}
                className="mb-4 p-4 bg-gray-50 rounded-md"
              >
                <div className="mb-3">
                  <label
                    htmlFor="categoryName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`h-8 rounded-md border-2 ${
                          categoryFormData.color === color.value
                            ? `border-gray-800 bg-${color.value}-200`
                            : `border-gray-200 bg-${color.value}-100`
                        }`}
                        onClick={() =>
                          setCategoryFormData({
                            ...categoryFormData,
                            color: color.value,
                          })
                        }
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={
                      createCategoryMutation.isPending ||
                      !categoryFormData.name.trim()
                    }
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {editingCategoryId
                      ? createCategoryMutation.isPending
                        ? "Updating..."
                        : "Update Category"
                      : createCategoryMutation.isPending
                        ? "Creating..."
                        : "Create Category"}
                  </button>
                </div>
              </form>
            )}

            {/* Categories list */}
            <div className="space-y-2">
              {sessionCategories.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No categories yet. Create one to help organize your ideas.
                </p>
              ) : (
                sessionCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-2 rounded-md bg-${category.color}-50 border border-${category.color}-100`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-2`}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: Ideas display */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Ideas ({ideas?.length || 0})
            </h2>

            {/* Ideas list */}
            {!ideas || ideas.length === 0 ? (
              <p className="text-gray-500">
                No ideas yet. Add your first idea using the form.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((idea) => {
                  const category = sessionCategories.find(
                    (c) => c.id === idea.categoryId
                  );

                  return (
                    <div
                      key={idea.id}
                      className={`p-4 rounded-lg border ${
                        category
                          ? `border-${category.color}-200 bg-${category.color}-50`
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {editingIdeaId === idea.id ? (
                        // Edit form
                        <form onSubmit={handleUpdateIdea}>
                          <div className="mb-3">
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={3}
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

                          <div className="mb-3">
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setEditingIdeaId(null)}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={
                                updateIdeaMutation.isPending ||
                                !editingIdeaData.content.trim()
                              }
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {updateIdeaMutation.isPending
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        // Idea display
                        <>
                          {category && (
                            <div className="mb-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-${category.color}-100 text-${category.color}-800`}
                              >
                                {category.name}
                              </span>
                            </div>
                          )}

                          <p className="mb-3">{idea.content}</p>

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>
                              Added{" "}
                              {new Date(idea.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditIdea(idea)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteIdea(idea.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSessionPage;
