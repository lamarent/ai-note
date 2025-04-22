# AI Brainstorm App API Design

This document outlines the API design for the AI Brainstorm application, including endpoints, request/response formats, and data models.

## API Overview

The AI Brainstorm API follows RESTful principles and is implemented using Hono on Cloudflare Workers. All endpoints return JSON responses and accept JSON requests where applicable.

Base URL: `/api/v1`

## Data Models

### Session

```typescript
interface Session {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  ideas: Idea[];
}
```

### Idea

```typescript
interface Idea {
  id: string;
  content: string;
  sessionId: string;
  category?: string;
  tags?: string[];
  position: number; // For ordering
  parentId?: string; // For hierarchical ideas
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isAiGenerated: boolean;
}
```

### AIPrompt

```typescript
interface AIPrompt {
  sessionId: string;
  prompt: string;
  context?: string; // Additional context for the AI
  ideaId?: string; // If expanding a specific idea
  technique?: string; // Brainstorming technique to use
  count?: number; // Number of ideas to generate
}
```

### ApiKeyEntry

```typescript
interface ApiKeyEntry {
  id: string;
  provider: string;
  model: string;
  key: string;
  createdAt: string; // ISO date string
}
```

### Local Storage Schema

- `ai-brainstorm-api-key-entries`: A JSON-serialized array of `ApiKeyEntry` objects.
- `ai-brainstorm-active-entry-id`: The `id` of the currently active `ApiKeyEntry`.
- UI components listen for `apiKeyEntriesChanged` and `activeEntryIdChanged` events to stay in sync.

## API Endpoints

### Sessions

#### GET /sessions

Get all sessions.

**Response:**

```json
{
  "sessions": [Session]
}
```

#### GET /sessions/:id

Get a specific session by ID, including all its ideas.

**Response:**

```json
{
  "session": Session
}
```

#### POST /sessions

Create a new brainstorming session.

**Request:**

```json
{
  "title": "string",
  "description": "string" // optional
}
```

**Response:**

```json
{
  "session": Session
}
```

#### PUT /sessions/:id

Update a session.

**Request:**

```json
{
  "title": "string", // optional
  "description": "string" // optional
}
```

**Response:**

```json
{
  "session": Session
}
```

#### DELETE /sessions/:id

Delete a session.

**Response:**

```json
{
  "success": true
}
```

### Ideas

#### GET /sessions/:sessionId/ideas

Get all ideas for a session.

**Response:**

```json
{
  "ideas": [Idea]
}
```

#### POST /sessions/:sessionId/ideas

Add a new idea to a session.

**Request:**

```json
{
  "content": "string",
  "category": "string", // optional
  "tags": ["string"], // optional
  "parentId": "string" // optional
}
```

**Response:**

```json
{
  "idea": Idea
}
```

#### PUT /ideas/:id

Update an idea.

**Request:**

```json
{
  "content": "string", // optional
  "category": "string", // optional
  "tags": ["string"], // optional
  "position": number, // optional
  "parentId": "string" // optional
}
```

**Response:**

```json
{
  "idea": Idea
}
```

#### DELETE /ideas/:id

Delete an idea.

**Response:**

```json
{
  "success": true
}
```

#### PUT /ideas/reorder

Reorder multiple ideas at once.

**Request:**

```json
{
  "orders": [
    {
      "id": "string",
      "position": number
    }
  ]
}
```

**Response:**

```json
{
  "success": true
}
```

### AI Integration

#### POST /ai/generate

Generate new ideas using AI.

**Request:**

```json
{
  "sessionId": "string",
  "prompt": "string",
  "context": "string", // optional
  "technique": "string", // optional
  "count": number // optional, default: 5
}
```

**Response:**

```json
{
  "ideas": [Idea]
}
```

#### POST /ai/expand

Expand on a specific idea using AI.

**Request:**

```json
{
  "ideaId": "string",
  "sessionId": "string",
  "depth": number // optional, default: 1
}
```

**Response:**

```json
{
  "ideas": [Idea]
}
```

### Export

#### GET /export/sessions/:id/markdown

Export a session as Markdown.

**Response:**

```
Content-Type: text/markdown
```

#### GET /export/sessions/:id/json

Export a session as JSON.

**Response:**

```json
Session
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // optional additional details
  }
}
```

Common error codes:

- `not_found`: Resource not found
- `validation_error`: Invalid input
- `unauthorized`: Not authorized to access the resource
- `ai_error`: Error from the AI service
- `server_error`: Internal server error

## Validation

Input validation will be performed using Zod schemas to ensure data integrity and type safety.

## Rate Limiting

API endpoints are rate-limited to prevent abuse, particularly for AI-intensive operations:

- General endpoints: 100 requests per minute
- AI endpoints: 20 requests per minute

## Future API Extensions

Future API endpoints (post-MVP) may include:

- User authentication and management
- Collaboration features
- Advanced AI capabilities
- Integrations with third-party services
