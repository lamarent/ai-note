# Repository Pattern in AI Brainstorm

This document describes the repository pattern implementation in the AI Brainstorm application.

## Overview

The repository pattern is a design pattern that isolates the data layer from the rest of the application. In our implementation:

- Each model has its own repository class
- Repositories handle all database operations for their model
- Repositories use the Prisma client to access the database
- The application uses repositories instead of direct database access

## Repository Classes

### Base Structure

Each repository follows a similar pattern:

```typescript
export class ModelRepository {
  constructor(private prisma: PrismaClientType) {}

  async findAll() { ... }
  async findById(id: string) { ... }
  async create(data: { ... }) { ... }
  async update(id: string, data: { ... }) { ... }
  async delete(id: string) { ... }
  // Model-specific methods
}
```

### Available Repositories

1. **UserRepository**

   - `findAll()`: Get all users
   - `findById(id)`: Get user by ID
   - `findByEmail(email)`: Get user by email
   - `create(data)`: Create a new user
   - `update(id, data)`: Update a user
   - `delete(id)`: Delete a user

2. **SessionRepository**

   - `findAll()`: Get all sessions with related data
   - `findById(id)`: Get session by ID
   - `findByOwnerId(ownerId)`: Get sessions by owner
   - `create(data)`: Create a new session
   - `update(id, data)`: Update a session
   - `delete(id)`: Delete a session

3. **IdeaRepository**

   - `findAll()`: Get all ideas with related data
   - `findById(id)`: Get idea by ID
   - `findBySessionId(sessionId)`: Get ideas by session
   - `findByCategoryId(categoryId)`: Get ideas by category
   - `create(data)`: Create a new idea
   - `update(id, data)`: Update an idea
   - `delete(id)`: Delete an idea
   - `deleteBySessionId(sessionId)`: Delete all ideas in a session

4. **CategoryRepository**
   - `findAll()`: Get all categories with related data
   - `findById(id)`: Get category by ID
   - `findBySessionId(sessionId)`: Get categories by session
   - `create(data)`: Create a new category
   - `update(id, data)`: Update a category
   - `delete(id)`: Delete a category
   - `deleteBySessionId(sessionId)`: Delete all categories in a session

## Special Handling

### Position Field in IdeaRepository

The `Idea` model has a `position` field that stores coordinates as a JSON string (due to D1 database limitations):

- In the database: `position` is stored as a string (JSON serialized)
- In the API: `position` is exposed as an object: `{ x: number, y: number }`
- The repository handles serialization/deserialization automatically

```typescript
// Creating an idea with position
await ideaRepo.create({
  content: "My idea",
  position: { x: 100, y: 200 },
  sessionId: "session-id",
});

// Retrieving an idea
const idea = await ideaRepo.findById("idea-id");
console.log(idea.position); // { x: 100, y: 200 }
```

## Using Repositories in the Backend

Here's how to use repositories in the backend:

```typescript
import { getPrismaClient, UserRepository } from "@ai-brainstorm/database";

// In a Cloudflare Worker
export default {
  async fetch(request, env, ctx) {
    // Get the Prisma client
    const prisma = await getPrismaClient(env.DB);

    // Create repositories
    const userRepo = new UserRepository(prisma);

    // Use repositories
    const users = await userRepo.findAll();

    return new Response(JSON.stringify(users));
  },
};
```

## Error Handling

Repositories pass through errors from Prisma. Common errors to handle:

- `PrismaClientKnownRequestError`: For expected database errors (e.g., unique constraint violations)
- `PrismaClientValidationError`: For validation errors (e.g., missing required fields)
- `PrismaClientUnknownRequestError`: For unexpected database errors

## Next Steps

- Add error handling utilities
- Add unit tests for repositories
- Add validation using schemas from the types package
