# Header Refactoring Context

**Date:** $(date +%Y-%m-%d)

**Change:**

- Removed the `<Header>` component from the main `Layout.tsx`.
- Removed the `showNavigation` prop from `Layout.tsx`.
- Added `<Header>` component import and usage to individual page components:
  - `packages/frontend/src/pages/home/HomePage.tsx` (title: "AI Brainstorm - Home")
  - `packages/frontend/src/pages/sessions/SessionsListPage.tsx` (title: "Sessions")
  - `packages/frontend/src/pages/sessions/SessionDetailPage.tsx` (dynamic title: session title, with fallbacks for loading/error)

**Reason:**

To allow each page to control its own header content, particularly the title, making the structure more modular.

**Files Affected:**

- `packages/frontend/src/components/layout/Layout.tsx`
- `packages/frontend/src/pages/home/HomePage.tsx`
- `packages/frontend/src/pages/sessions/SessionsListPage.tsx`
- `packages/frontend/src/pages/sessions/SessionDetailPage.tsx`
