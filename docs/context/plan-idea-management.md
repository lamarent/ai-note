# Idea Management Implementation Plan

**Date:** $(date +%Y-%m-%d)

**Goal:** Implement core CRUD functionality for managing ideas within a brainstorming session.

**Status:** Basic CRUD functionality (fetch, create, update, delete) is already implemented using `useIdeas` hooks, `IdeasList`, `IdeaForm`, and `IdeaItem`.

**Plan:**

1.  **Backend API Endpoints (Assumption):** (Verified: API exists and is used by hooks)

    - `GET /api/sessions/:sessionId/ideas`
    - `POST /api/ideas` (Note: Hook uses this path, likely takes sessionId in body)
    - `PUT /api/ideas/:ideaId`
    - `DELETE /api/ideas/:ideaId`

2.  **React Query Hooks (`packages/frontend/src/hooks/useIdeas.ts`):** (Verified: Hooks exist and are used)

    - `useGetIdeasBySession(sessionId)`
    - `useCreateIdea()`
    - `useUpdateIdea()`
    - `useDeleteIdea()`

3.  **Frontend Components (`packages/frontend/src/components/ideas/`):** (Verified: Components exist)

    - `IdeaCard.tsx`: Displays a single idea using the common `Card` component. (To be used)
    - `IdeaItem.tsx`: Simpler display component for an idea. (Currently used)
    - `IdeaForm.tsx`: Form for creating/editing ideas.
    - `IdeasList.tsx`: Displays the list, handles create/edit/delete logic.

4.  **Integration (`packages/frontend/src/pages/sessions/SessionDetailPage.tsx`):** (Verified: Integrated)
    - `IdeasList` is rendered in the "Ideas" tab.

**Refinement Plan:**

1.  **Replace `IdeaItem` with `IdeaCard` in `IdeasList.tsx`:**

    - Update imports.
    - Replace component usage, ensuring props match (`idea`, `onEdit`, `onDelete`).
    - _(Optional future step: Pass `categoryColor` if categories are implemented)_

2.  **(Future) Implement Category Management:** Add functionality to create, assign, and filter by categories.
3.  **(Future) Implement Drag-and-Drop:** Utilize `IdeaCard`'s `isDraggable` prop.

**Next Steps:**

- Execute Refinement Plan step 1: Replace `IdeaItem` with `IdeaCard` in `IdeasList.tsx`.
