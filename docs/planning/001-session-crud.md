# Plan: Implement Core Brainstorming Session Functionality (CRUD)

**Goal:** Implement the basic Create, Read (List/View), Update, and Delete operations for brainstorming sessions.

**Reference:** `docs/context/state/next-steps.md` - Short-term Goal #1

**Status:** In Progress

## Tasks

### 1. Backend API (`packages/backend`)

- [ ] **Define Prisma Model:** Ensure the `Session` model in `prisma/schema.prisma` is sufficient.
  - Fields needed: `id`, `title`, `createdAt`, `updatedAt`. (Add `title` if not present).
- [ ] **Create Session Endpoint:**
  - Route: `POST /api/sessions`
  - Input: `{ title: string }` (Validated using shared Zod schema)
  - Action: Create a new session record in the database.
  - Output: The created session object.
- [ ] **List Sessions Endpoint:**
  - Route: `GET /api/sessions`
  - Action: Retrieve all sessions from the database.
  - Output: Array of session objects.
- [ ] **Get Session Endpoint:**
  - Route: `GET /api/sessions/:id`
  - Action: Retrieve a specific session by ID.
  * Output: The session object or 404 error.
- [ ] **Update Session Endpoint:**
  - Route: `PUT /api/sessions/:id`
  - Input: `{ title: string }` (Validated)
  - Action: Update the specified session.
  - Output: The updated session object.
- [ ] **Delete Session Endpoint:**
  - Route: `DELETE /api/sessions/:id`
  - Action: Delete the specified session.
  - Output: Success message or 204 No Content.
- [ ] **API Tests:** Add basic tests for each endpoint.

### 2. Frontend UI (`packages/frontend`)

- [ ] **Session Store (Zustand):**
  - State: `sessions` (array), `currentSession` (object or null), `isLoading`, `error`.
  - Actions: `fetchSessions`, `createSession`, `getSession`, `updateSession`, `deleteSession`.
- [ ] **Create Session Component:**
  - UI: Button to trigger creation, maybe a simple form/modal for title.
  - Action: Call `createSession` store action.
- [ ] **Session List Component:**
  - UI: Display a list of sessions fetched from the store.
  - Action: Fetch sessions on mount (`fetchSessions`). Allow clicking a session to view/select it.
- [ ] **Session View/Edit Component:**
  - UI: Display details of the `currentSession`. Allow editing the title.
  - Action: Call `updateSession` store action.
- [ ] **Delete Session Button:**
  - UI: Button within the list or view component.
  - Action: Call `deleteSession` store action.
- [ ] **Routing:** Set up routes for listing sessions and viewing a specific session (e.g., `/sessions`, `/sessions/:id`).

### 3. Shared Types (`packages/types`)

- [ ] **Session Schema:** Define/update Zod schema for `Session` and related API inputs/outputs.

## Next Steps (Immediate)

1.  Review/update Prisma schema.
2.  Implement `POST /api/sessions` endpoint.
3.  Implement `createSession` action in Zustand store.
4.  Implement basic "Create Session" UI component.

---

_Tracking based on initial goal definition._
