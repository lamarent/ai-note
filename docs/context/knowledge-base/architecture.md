# Architecture Knowledge Base

This document contains additional notes and knowledge about the architecture beyond the formal architecture documentation.

## Frontend Architecture Notes

### Component Organization

We're organizing React components following this pattern:

1. **Atomic Design Principles** - Atoms, Molecules, Organisms, Templates, Pages
2. **Feature-First Organization** - Group by feature rather than component type
3. **Co-location of Related Files** - Keep styles, tests, and components together

Example structure:

```
/components
  /ui              # Reusable UI components (atoms/molecules)
    /Button
    /Card
    /Input
  /features        # Feature-specific components (organisms)
    /sessions
      /SessionCard
      /SessionList
      /SessionForm
    /ideas
      /IdeaCard
      /IdeaList
      /IdeaForm
    /ai
      /PromptInput
      /SuggestionList
```

### State Management Approach

- **Zustand**: For global application state
- **React Query**: For server state and data fetching
- **Local State**: For component-specific state

State separation:

- **UI State**: Modals, tooltips, current tab (Zustand)
- **Data State**: Sessions, ideas (React Query)
- **Form State**: Input values, validation (React Hook Form)

## Backend Architecture Notes

### API Design Philosophy

- RESTful endpoints for CRUD operations
- Consistent response format
- Error codes standardization
- Validation at the controller level

### Middleware Stack

Typical request flow:

1. CORS handling
2. Request logging
3. Authentication (future)
4. Request validation
5. Rate limiting
6. Route handling
7. Error handling

### Error Handling Strategy

- Use HTTP status codes correctly
- Provide detailed error messages in development
- Sanitize error details in production
- Log errors with context for debugging

## Database Access Patterns

### Prisma Usage Guidelines

- Create service modules to encapsulate database operations
- Use transactions for multi-step operations
- Prefer Prisma's fluent API over raw queries when possible
- Use `include` judiciously to avoid over-fetching

### Query Optimization

- Use `select` to limit returned fields
- Implement pagination for large collections
- Consider denormalization for frequently accessed data
- Create indexes for common query patterns

## Integration Points

### Frontend-Backend Communication

- API client with automatic error handling
- Standardized request/response format
- Authentication header management (future)

### AI Service Integration

- Service abstraction layer for provider flexibility
- Caching strategy for duplicate requests
- Retry logic for API failures
- Rate limiting to control costs

## Development Conventions

### TypeScript Usage

- Prefer interfaces for public APIs
- Use type aliases for complex types
- Leverage utility types (Pick, Omit, Partial, etc.)
- Strict null checks enforced

### Code Organization

- Services for business logic
- Controllers for request handling
- Models for data structures
- Utils for shared functionality

## Monorepo Structure

The project is structured as a monorepo using pnpm workspaces:

```
/
├── packages/
│   ├── frontend/         # React frontend application
│   ├── backend/          # Cloudflare Worker API
│   ├── database/         # Prisma with D1 database
│   ├── types/            # Shared TypeScript types and Zod schemas
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configuration (eslint, typescript, etc)
├── docs/                 # Project documentation
│   ├── adr/              # Architecture Decision Records
│   ├── api/              # API documentation
│   └── context/          # Context tracking for AI-assisted development
└── scripts/              # Project-wide scripts
```

## Package Dependencies

The dependencies between packages are as follows:

- `frontend` depends on `types`, `ui`
- `backend` depends on `types`, `database`
- `database` has no internal dependencies
- `ui` depends on `types`
- `types` has no internal dependencies

## Database Architecture

The database is implemented using Prisma ORM with Cloudflare D1:

- **Prisma**: Used for type-safe database access and schema management
- **D1 Adapter**: Custom adapter to connect Prisma with Cloudflare D1
- **SQLite Dialect**: D1 uses SQLite under the hood

### Database Models

The core data models are:

1. **User**: Represents a user of the application

   - Properties: id, email, name, createdAt, updatedAt
   - Relations: ownedSessions, collaboratedSessions

2. **Session**: Represents a brainstorming session

   - Properties: id, title, description, createdAt, updatedAt, ownerId
   - Relations: owner, collaborators, ideas, categories

3. **Idea**: Represents an individual idea within a session

   - Properties: id, content, position, createdAt, updatedAt, sessionId, categoryId
   - Relations: session, category

4. **Category**: Represents a grouping category for ideas
   - Properties: id, name, color, createdAt, updatedAt, sessionId
   - Relations: session, ideas

### Database Integration

Database integration is facilitated through the following components:

1. **Prisma Schema**: Defined in `packages/database/prisma/schema.prisma`
2. **SQL Migrations**: Generated from Prisma schema, stored in `packages/database/prisma/migrations`
3. **D1 Adapter**: Connects Prisma to D1 database in Cloudflare Workers

_Last updated: 2025-04-17_
