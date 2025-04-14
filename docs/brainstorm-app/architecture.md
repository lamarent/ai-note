# Architecture Overview - AI-Powered Brainstorming App

## System Architecture

The application follows a modern client-server architecture with these key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  API Backend    │────▶│   AI Service    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                      │
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ State Management│     │    Database     │     │  OpenAI API     │
│    (Zustand)    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Component Breakdown

### Frontend Components

1. **Core Components**

   - `BrainstormSession`: Main container for a brainstorming session
   - `IdeaCard`: Card component for individual ideas
   - `IdeaBoard`: Canvas for organizing and grouping ideas
   - `AIPromptPanel`: Interface for interacting with AI

2. **State Management**

   - Session state (active session, participants, settings)
   - Ideas state (all ideas, their relationships, metadata)
   - UI state (current view, active panels, etc.)

3. **Services**
   - `api.service.ts`: Handles all API requests
   - `ai.service.ts`: Manages AI-related functionality
   - `export.service.ts`: Handles exporting brainstorm sessions

### Backend Components

1. **API Layer**

   - RESTful endpoints for CRUD operations
   - WebSocket for real-time collaboration
   - Authentication middleware

2. **Core Services**

   - `SessionService`: Manages brainstorming sessions
   - `IdeaService`: Handles idea creation and organization
   - `AIService`: Interface with OpenAI API

3. **Data Layer**
   - Database models and schema
   - Data validation and sanitization

## Data Flow

1. **Idea Generation Flow**

   - User inputs a topic or theme
   - Request is sent to backend
   - Backend formats and sends prompt to OpenAI API
   - AI generates ideas
   - Ideas are processed and returned to frontend
   - Frontend displays ideas as interactive cards

2. **Collaboration Flow**
   - Changes in the brainstorming session are captured in real-time
   - Updates are broadcast to all connected clients via WebSockets
   - Each client's state is synchronized

## Integration Points

1. **AI Integration**

   - OpenAI API for idea generation and refinement
   - Custom prompt templates for different brainstorming methods

2. **External Services**
   - Authentication provider (Auth0/Clerk)
   - Data storage (MongoDB/PostgreSQL)
   - Export services (PDF generation, etc.)

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│            Client (Web Browser)             │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              CDN / Edge Network             │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│            Frontend (Vercel/Netlify)        │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│            Backend API (Railway)            │
└─────────┬─────────────────────┬─────────────┘
          │                     │
          ▼                     ▼
┌─────────────────┐     ┌─────────────────────┐
│    Database     │     │     OpenAI API      │
└─────────────────┘     └─────────────────────┘
```
