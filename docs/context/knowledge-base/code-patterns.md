# Code Patterns

This document outlines common code patterns and conventions used throughout the AI Brainstorm application.

## Frontend Patterns

### Component Structure

```tsx
// Standard component structure
import { useState } from 'react';
import { Button } from '../ui/Button';
import type { ComponentProps } from './types';
import { useStyles } from './styles';

export const MyComponent = ({ 
  title, 
  onAction 
}: ComponentProps) => {
  // State hooks first
  const [isOpen, setIsOpen] = useState(false);
  
  // Custom hooks next
  const styles = useStyles();
  
  // Event handlers
  const handleClick = () => {
    setIsOpen(true);
    onAction();
  };
  
  // Render logic/early returns
  if (!title) return null;
  
  // Component JSX
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <Button onClick={handleClick}>
        Click Me
      </Button>
    </div>
  );
};
```

### API Calls with React Query

```tsx
// API client definition (in a separate file)
const fetchSessions = async (): Promise<Session[]> => {
  const response = await fetch('/api/v1/sessions');
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
};

// Usage in component
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSessions, createSession } from '../api/sessions';

export const SessionList = () => {
  const queryClient = useQueryClient();
  
  // Query
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions
  });
  
  // Mutation
  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });
  
  // Component JSX
  // ...
};
```

### Zustand Store Pattern

```tsx
// store.ts
import { create } from 'zustand';

interface UIState {
  isMenuOpen: boolean;
  theme: 'light' | 'dark';
  setMenuOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  theme: 'light',
  setMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  }))
}));
```

## Backend Patterns

### Hono Route Definition

```typescript
// Route module pattern
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { sessionService } from '../services/session-service';

// Define schemas
const createSessionSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional()
});

// Create router
const sessionsRouter = new Hono();

// Define routes
sessionsRouter.get('/', async (c) => {
  const sessions = await sessionService.getAllSessions();
  return c.json({ sessions });
});

sessionsRouter.post('/', zValidator('json', createSessionSchema), async (c) => {
  const data = c.req.valid('json');
  const session = await sessionService.createSession(data);
  return c.json({ session }, 201);
});

// ...more routes

export { sessionsRouter };
```

### Service Pattern

```typescript
// Service module pattern
import { prisma } from '../db';
import type { Session, Prisma } from '@prisma/client';

export const sessionService = {
  // Get all sessions
  async getAllSessions(): Promise<Session[]> {
    return prisma.session.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },
  
  // Get a single session with ideas
  async getSessionById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
      include: { ideas: true }
    });
  },
  
  // Create a new session
  async createSession(data: Prisma.SessionCreateInput): Promise<Session> {
    return prisma.session.create({ data });
  },
  
  // Update a session
  async updateSession(id: string, data: Prisma.SessionUpdateInput): Promise<Session | null> {
    return prisma.session.update({
      where: { id },
      data
    });
  },
  
  // Delete a session
  async deleteSession(id: string): Promise<boolean> {
    await prisma.session.delete({
      where: { id }
    });
    return true;
  }
};
```

### Error Handling Pattern

```typescript
// Error middleware pattern
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, any>;
  
  constructor(message: string, statusCode: number, code: string, details?: Record<string, any>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Error middleware
export const errorMiddleware = async (c, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof AppError) {
      return c.json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }, error.statusCode);
    }
    
    if (error instanceof HTTPException) {
      return c.json({
        error: {
          code: 'http_error',
          message: error.message
        }
      }, error.status);
    }
    
    console.error('Unhandled error:', error);
    
    return c.json({
      error: {
        code: 'server_error',
        message: 'An unexpected error occurred'
      }
    }, 500);
  }
};
```

## Shared Patterns

### Zod Schema Definition

```typescript
// Shared schema definition pattern
import { z } from 'zod';

// Base schemas
export const sessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ideaSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  sessionId: z.string().uuid(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  position: z.number().int().min(0),
  parentId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isAiGenerated: z.boolean().default(false)
});

// Request schemas
export const createSessionSchema = sessionSchema.pick({
  title: true,
  description: true
});

export const updateSessionSchema = createSessionSchema.partial();

// Response schemas
export const sessionResponseSchema = sessionSchema.extend({
  ideas: z.array(ideaSchema).optional()
});

export const sessionsResponseSchema = z.object({
  sessions: z.array(sessionSchema)
});

// Type exports
export type Session = z.infer<typeof sessionSchema>;
export type Idea = z.infer<typeof ideaSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
```

## Testing Patterns

### Component Testing

```tsx
// Component test pattern
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionCard } from './SessionCard';

describe('SessionCard', () => {
  const mockSession = {
    id: '123',
    title: 'Test Session',
    description: 'A test session',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const mockOnClick = jest.fn();
  
  it('renders the session title', () => {
    render(<SessionCard session={mockSession} onClick={mockOnClick} />);
    expect(screen.getByText('Test Session')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    render(<SessionCard session={mockSession} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith('123');
  });
});
```

### API Testing

```typescript
// API test pattern
import { app } from '../src/app';
import request from 'supertest';
import { prisma } from '../src/db';

describe('Sessions API', () => {
  beforeAll(async () => {
    // Set up test database
    await prisma.$connect();
  });
  
  afterAll(async () => {
    // Clean up
    await prisma.$disconnect();
  });
  
  beforeEach(async () => {
    // Clear data between tests
    await prisma.idea.deleteMany();
    await prisma.session.deleteMany();
  });
  
  it('should return an empty array when no sessions exist', async () => {
    const response = await request(app.fetch).get('/api/v1/sessions');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ sessions: [] });
  });
  
  it('should create a new session', async () => {
    const response = await request(app.fetch)
      .post('/api/v1/sessions')
      .send({
        title: 'New Session',
        description: 'A new test session'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.session).toHaveProperty('id');
    expect(response.body.session.title).toBe('New Session');
  });
});
```

---

*Last updated: 2023-08-28* 