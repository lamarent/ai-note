import React, { useState } from "react";
import Button from "../common/Button";
import { useGetCategoriesBySession, useCreateCategory } from "../../hooks";
import { Category } from "@ai-brainstorm/types";

interface CategorySelectorProps {
  selectedCategoryId?: string;
  onChange: (categoryId?: string) => void;
  sessionId: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategoryId,
  onChange,
  sessionId,
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6419E6"); // Default color (primary in daisyUI)

  // Get all categories
  const { data: categories = [], isLoading } =
    useGetCategoriesBySession(sessionId);

  // Create category mutation
  const createCategory = useCreateCategory({
    onSuccess: () => {
      setIsAddingCategory(false);
      setNewCategoryName("");
    },
  });

  // Handle adding a new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    createCategory.mutate({
      name: newCategoryName,
      color: newCategoryColor,
      sessionId,
    });
  };

  // Handle category selection
  const handleCategorySelect = (categoryId?: string) => {
    onChange(categoryId);
  };

  if (isLoading) {
    return <div className="skeleton h-10 w-full"></div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          className={`badge ${
            !selectedCategoryId ? "badge-primary" : "badge-outline"
          } cursor-pointer`}
          onClick={() => handleCategorySelect(undefined)}
        >
          All
        </button>

        {categories.map((category: Category) => (
          <button
            key={category.id}
            className={`badge ${
              selectedCategoryId === category.id
                ? "badge-primary"
                : "badge-outline"
            } cursor-pointer`}
            style={{
              borderColor: category.color,
              backgroundColor:
                selectedCategoryId === category.id
                  ? category.color
                  : "transparent",
            }}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </button>
        ))}

        <button
          className="badge badge-outline cursor-pointer"
          onClick={() => setIsAddingCategory(true)}
        >
          + Add Category
        </button>
      </div>

      {isAddingCategory && (
        <div className="card bg-base-200 p-4">
          <h3 className="text-sm font-medium mb-2">Add New Category</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="input input-bordered input-sm flex-grow"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="color"
              className="w-10 h-10 cursor-pointer rounded"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsAddingCategory(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              isLoading={createCategory.isPending}
            >
              Add
            </Button>
          </div>
          {createCategory.isError && (
            <p className="text-error text-xs mt-1">
              {createCategory.error?.message || "Error creating category"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
