# Categories Implementation Plan

## Overview

The Categories feature allows users to organize ideas within a session by categorizing them. Each category has a name and color, and ideas can optionally belong to a category.

## Data Model

```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}
```

## API Services

1. Create `categoryApi.ts` service with the following methods:

   - `getAll()`: Get all categories
   - `getById(id: string)`: Get a category by ID
   - `getBySessionId(sessionId: string)`: Get categories for a session
   - `create(data: CreateCategoryInput)`: Create a new category
   - `update(id: string, data: UpdateCategoryInput)`: Update a category
   - `delete(id: string)`: Delete a category

2. Create `useCategories.ts` React Query hooks:
   - `useGetCategories()`: Hook for getting all categories
   - `useGetCategoriesBySessionId(sessionId: string)`: Hook for getting categories by session
   - `useCreateCategory()`: Hook for creating a category
   - `useUpdateCategory()`: Hook for updating a category
   - `useDeleteCategory()`: Hook for deleting a category

## Components

1. Create `CategoryTag.tsx` component:

   - Display category name with colored background
   - Optional click handler for filtering/selection

2. Create `CategoryForm.tsx` component:

   - Form for creating/editing a category
   - Fields for name and color
   - Color picker UI with predefined color options
   - Validation and error handling

3. Create `CategoriesList.tsx` component:

   - Display list of categories in a session
   - Options to add, edit, and delete categories
   - Used in session detail page

4. Update `IdeaCard.tsx` to display category:

   - Show category tag if idea has a category
   - Use category color for card border/accent

5. Update `IdeaForm.tsx` to include category selection:
   - Add dropdown for selecting a category
   - Option to create a new category inline

## Implementation Steps

1. **API Layer**:

   - Implement `categoryApi.ts` service
   - Implement React Query hooks in `useCategories.ts`
   - Test API integration

2. **UI Components**:

   - Create `CategoryTag.tsx` component
   - Create `CategoryForm.tsx` component
   - Create `CategoriesList.tsx` component
   - Update `IdeaCard.tsx` to show category
   - Update `IdeaForm.tsx` for category selection

3. **Integration**:

   - Add categories management section to SessionDetailPage
   - Implement filtering ideas by category
   - Add category color indicators

4. **Testing and Refinement**:
   - Test all CRUD operations
   - Verify UI/UX flow
   - Fix any bugs or usability issues

## UI Mockups

### Category Tag

```
┌─────────────┐
│ Category    │  <- Colored background based on category.color
└─────────────┘
```

### Categories List

```
┌───────────────────────────────────┐
│ Categories                    [+] │  <- Add button
├───────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐  │
│ │ Category 1  │ │ Category 2  │  │  <- Category tags
│ └─────────────┘ └─────────────┘  │
│                                   │
│ ┌─────────────┐                   │
│ │ Category 3  │                   │
│ └─────────────┘                   │
└───────────────────────────────────┘
```

### Category Form

```
┌───────────────────────────────────┐
│ Add/Edit Category                 │
├───────────────────────────────────┤
│ Name:                             │
│ ┌───────────────────────────────┐ │
│ │ Category name                 │ │
│ └───────────────────────────────┘ │
│                                   │
│ Color:                            │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  │  <- Color options
│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │  │
│ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘  │
│                                   │
│ [Cancel]               [Save]     │
└───────────────────────────────────┘
```

## Timeline

1. API Layer: 1 day
2. UI Components: 2 days
3. Integration: 1 day
4. Testing and Refinement: 1 day

Total: 5 days
