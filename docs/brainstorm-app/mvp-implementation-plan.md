# AI-Powered Brainstorming App: MVP Implementation Plan (1 Week)

## MVP Scope

For our one-week MVP, we will focus on delivering these core functionalities:

1. **Basic Session Management**

   - Create/edit/delete a brainstorming session
   - Simple session dashboard

2. **Core Idea Management**

   - Add/edit/delete ideas
   - Basic drag-and-drop organization

3. **AI Assistance (Primary Feature)**

   - Generate ideas from a topic
   - Expand a single idea with AI

4. **Minimal UI**

   - Clean, functional interface
   - Single-user focused
   - Basic idea board layout

5. **Simple Export**
   - Export to Markdown only

### Features Excluded from MVP

- Real-time collaboration
- User authentication
- Multiple brainstorming templates
- Advanced organization features
- Complex export formats
- Admin features

## Technology Stack for MVP

To move quickly, we'll use a streamlined stack:

- **Frontend**: React with Vite, TypeScript, Tailwind CSS
- **UI Components**: Use DaisyUI for rapid development
- **State Management**: Simple React Context + hooks (defer Zustand for post-MVP)
- **Backend**: Express.js for API endpoints
- **AI Integration**: OpenAI API via backend proxy
- **Persistence**: Local storage for MVP (no database yet)
- **Deployment**: Vercel (frontend) and Railway (backend)

## Technical Implementation Details

### Frontend Architecture

1. **Project Structure**

   ```
   src/
   ├── assets/           # Static assets
   ├── components/       # Reusable UI components
   │   ├── common/       # Generic UI components
   │   ├── ideas/        # Idea-related components
   │   ├── sessions/     # Session-related components
   │   └── layout/       # Layout components
   ├── context/          # React context providers
   │   ├── SessionContext.tsx
   │   └── IdeaContext.tsx
   ├── hooks/            # Custom React hooks
   ├── pages/            # Page components
   │   ├── Dashboard.tsx
   │   ├── SessionPage.tsx
   │   └── NotFound.tsx
   ├── services/         # API service layer
   │   ├── api.ts        # Base API utilities
   │   ├── aiService.ts  # AI-related API calls
   │   └── storageService.ts # Local storage interactions
   ├── types/            # TypeScript type definitions
   ├── utils/            # Utility functions
   ├── App.tsx           # Main application component
   ├── main.tsx          # Application entry point
   └── router.tsx        # Router configuration
   ```

2. **Core Components**

   - `SessionCard`: Displays session info and actions
   - `IdeaCard`: Displays single idea with edit/delete options
   - `IdeaBoard`: Canvas where ideas are displayed and organized
   - `AIPromptInput`: Input for AI idea generation
   - `IdeaExpander`: Interface for expanding ideas with AI

3. **State Management**
   - `SessionContext`: Manages active session state
   - `IdeaContext`: Manages ideas for the current session
   - Local Storage Service: Handles persistence between sessions

### Backend Architecture

1. **Project Structure**

   ```
   backend/
   ├── src/
   │   ├── controllers/  # Request handlers
   │   │   ├── aiController.ts
   │   │   └── sessionController.ts
   │   ├── services/     # Business logic
   │   │   └── openaiService.ts
   │   ├── utils/        # Utility functions
   │   │   ├── errorHandler.ts
   │   │   └── logger.ts
   │   ├── middleware/   # Express middleware
   │   │   ├── cors.ts
   │   │   └── errorMiddleware.ts
   │   ├── routes/       # API routes
   │   │   ├── aiRoutes.ts
   │   │   └── index.ts
   │   ├── types/        # TypeScript type definitions
   │   └── app.ts        # Express app setup
   ├── index.ts          # Entry point
   └── package.json
   ```

2. **API Endpoints**

   - `/api/ai/generate`: Generate ideas from a topic
   - `/api/ai/expand`: Expand a specific idea
   - Session management will be handled client-side for MVP

3. **OpenAI Integration**
   - Custom prompt templates for idea generation
   - Simple in-memory caching for similar requests
   - Error handling and rate limiting protection

## Day-by-Day Implementation Plan

### Day 1: Project Setup & Basic UI Framework

**Morning: Project Initialization**

- [ ] Initialize frontend project with Vite, React, TypeScript
- [ ] Set up Tailwind CSS and DaisyUI
- [ ] Create basic project structure
- [ ] Initialize Express.js backend

**Afternoon: Core UI Components**

- [ ] Create app layout with sidebar and main content area
- [ ] Implement session creation form
- [ ] Design basic home/dashboard view
- [ ] Set up routing between views

**End of Day Deliverable**: Basic application shell that allows navigation between home and session creation.

### Day 2: Session Management & Idea Board

**Morning: Session Management**

- [ ] Implement session creation functionality
- [ ] Set up local storage for session persistence
- [ ] Create session list and details components
- [ ] Implement session deletion

**Afternoon: Basic Idea Board**

- [ ] Create idea card component
- [ ] Implement basic idea creation/editing
- [ ] Set up drag-and-drop functionality for idea organization
- [ ] Implement idea deletion

**End of Day Deliverable**: Ability to create sessions and add/edit/move/delete ideas manually.

### Day 3: Backend & AI Integration

**Morning: Backend Setup**

- [ ] Set up Express.js routes for AI functionality
- [ ] Implement OpenAI API integration
- [ ] Create proxy endpoints for idea generation
- [ ] Set up error handling

**Afternoon: Frontend AI Integration**

- [ ] Create AI prompt input component
- [ ] Implement API service to communicate with backend
- [ ] Design idea suggestion UI
- [ ] Add loading states for AI operations

**End of Day Deliverable**: Backend service capable of generating ideas through OpenAI and frontend integration.

### Day 4: AI Features Completion

**Morning: Idea Generation**

- [ ] Complete the "generate ideas from topic" feature
- [ ] Implement adding AI suggestions to the board
- [ ] Add refresh/regenerate functionality
- [ ] Optimize prompt templates for better results

**Afternoon: Idea Expansion**

- [ ] Implement "expand idea" functionality
- [ ] Create UI for idea expansion results
- [ ] Add ability to incorporate expansions into existing ideas
- [ ] Implement basic caching for similar requests

**End of Day Deliverable**: Fully functional AI idea generation and expansion features.

### Day 5: Organization & Export

**Morning: Idea Organization**

- [ ] Improve drag-and-drop functionality
- [ ] Add basic grouping of ideas
- [ ] Implement zoom and pan on the idea board
- [ ] Add grid alignment for ideas

**Afternoon: Export Functionality**

- [ ] Create Markdown export service
- [ ] Implement export UI
- [ ] Add session metadata to exports
- [ ] Create basic print styling

**End of Day Deliverable**: Ability to organize ideas and export sessions to Markdown.

### Day 6: Polish & Optimization

**Morning: UI Refinement**

- [ ] Implement responsive design adjustments
- [ ] Add transitions and micro-interactions
- [ ] Improve overall visual design
- [ ] Ensure consistent styling

**Afternoon: Performance Optimization**

- [ ] Optimize rendering performance
- [ ] Add error boundaries and fallbacks
- [ ] Implement better state management
- [ ] Optimize API calls

**End of Day Deliverable**: Polished UI with improved performance and error handling.

### Day 7: Testing & Deployment

**Morning: Testing**

- [ ] Perform manual testing of all features
- [ ] Fix critical bugs
- [ ] Test on different devices and browsers
- [ ] Create basic documentation

**Afternoon: Deployment**

- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set up environment variables
- [ ] Perform final integration testing in production environment

**End of Day Deliverable**: Deployed MVP ready for user testing.

## Implementation Approach for Key Features

### AI Idea Generation

1. **Prompt Design**:

   ```typescript
   // Example prompt template for idea generation
   const generateIdeasPrompt = (topic: string, count: number = 5) => `
     Generate ${count} creative and diverse ideas related to the topic: "${topic}".
     Each idea should be unique and presented as a concise statement.
     Format the response as a JSON array of strings, with each string being a complete idea.
   `;
   ```

2. **Backend Implementation**:

   ```typescript
   // Simplified example of the OpenAI integration
   const generateIdeas = async (topic: string, count: number = 5) => {
     try {
       const response = await openai.createCompletion({
         model: "gpt-3.5-turbo-instruct",
         prompt: generateIdeasPrompt(topic, count),
         max_tokens: 500,
         temperature: 0.7,
       });

       // Parse the response to extract ideas
       const ideas = parseIdeasFromResponse(response.choices[0].text);
       return ideas;
     } catch (error) {
       console.error("Error generating ideas:", error);
       throw new Error("Failed to generate ideas");
     }
   };
   ```

### Drag and Drop Implementation

We'll use `react-beautiful-dnd` for the drag-and-drop functionality:

```typescript
// Simplified example of the idea board component
const IdeaBoard = ({ ideas, onMoveIdea }) => {
  return (
    <DragDropContext onDragEnd={(result) => onMoveIdea(result)}>
      <Droppable droppableId="idea-board">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="idea-board"
          >
            {ideas.map((idea, index) => (
              <Draggable key={idea.id} draggableId={idea.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <IdeaCard idea={idea} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
```

## Critical Path Items

These are the most important features that must be completed for a viable MVP:

1. Basic session creation and management
2. Idea creation and organization
3. AI-powered idea generation
4. Simple export functionality

## Testing Strategy

For the MVP, we'll focus on manual testing:

- Test each feature as it's developed
- Create a simple test plan for the final day
- Focus on user flows and critical functionality
- Test edge cases for AI functionality

## Post-MVP Priorities

After the MVP is launched, these should be our immediate priorities:

1. User authentication
2. Database integration for proper persistence
3. Basic real-time collaboration
4. Additional brainstorming templates
5. Enhanced export options

## Risk Management

Key risks for the one-week timeline:

1. **AI Integration Complexity**: Start this early (Day 3) and have fallback content ready
2. **Drag-and-Drop Issues**: Use a proven library and limit complex interactions for MVP
3. **Scope Creep**: Strictly adhere to the MVP feature set
4. **OpenAI API Limitations**: Implement proper error handling and retry logic

## Daily Stand-up Questions

Each day, answer these questions:

1. What was completed yesterday?
2. What will be worked on today?
3. Are there any blockers?
4. Is the project still on track for the 1-week timeline?
5. Does any part of the scope need to be adjusted?

## Required Environment Variables

```
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api

# Backend (.env)
PORT=3000
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=http://localhost:5173
```
