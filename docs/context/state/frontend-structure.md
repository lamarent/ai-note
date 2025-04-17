# Frontend Structure Documentation

## Overview

The frontend has been restructured following modern React best practices, with a focus on:

- Clear separation of concerns
- Modular and reusable components
- Type safety with TypeScript
- Efficient data fetching with React Query
- Consistent styling with Tailwind CSS

## Directory Structure

```
src/
├── assets/            # Static assets like images, fonts
├── components/        # Reusable UI components
│   ├── common/        # Shared UI components (Button, Card, Modal)
│   ├── forms/         # Form components (Input, etc)
│   ├── layout/        # Layout components (Header, Footer, Layout)
│   └── [feature]/     # Feature-specific components organized by domain
├── config/            # Configuration files
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
├── pages/             # Page components mapped to routes
│   ├── home/          # Home page components
│   ├── sessions/      # Session-related page components
│   └── ideas/         # Idea-related page components
├── services/          # API services and data fetching
│   ├── api/           # API client and endpoints
│   └── queries/       # React Query hooks
├── stores/            # State management (Zustand)
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
├── routes.tsx         # Application routes
└── index.css          # Global styles
```

## Key Components

### Common UI Components

- **Button**: Flexible button component with variants, sizes, loading states, and icon support
- **Card**: Container component with optional title, footer, and hover effects
- **Modal**: Accessible modal dialog with customizable content, title, and footer
- **Input**: Form input with label, error states, and icon support

### Layout Components

- **Header**: App header with navigation and branding
- **Footer**: App footer with copyright and links
- **Layout**: Main layout wrapper that combines Header and Footer

### Feature Components

#### Sessions

- **SessionsListPage**: Displays all sessions with creation and deletion functionality
- **SessionDetailPage**: Shows detailed view of a single session with editing capability

#### Ideas

- **IdeasList**: Displays all ideas in a session with grid layout
- **IdeaCard**: Card component for displaying a single idea with edit/delete options
- **IdeaForm**: Form for creating and editing ideas with validation

### Pages

- **HomePage**: Landing page with app introduction and navigation to sessions
- **SessionsListPage**: Displays all sessions with creation and deletion functionality
- **SessionDetailPage**: Shows detailed view of a single session with editing capability and ideas management

## Data Fetching

The application uses React Query for data fetching with a clean structure:

1. **API Services**: Base functionality for API communication (in `/services/api`)
2. **Query Hooks**: React Query hooks for each entity (in `/services/queries`)

### Example Flow

```tsx
// In a component
const { data: sessions, isLoading } = useGetSessions();

// In services/queries/useSessions.ts
export const useGetSessions = (options) => {
  return useQuery({
    queryKey: SESSION_KEYS.lists(),
    queryFn: () => sessionApi.getAll(),
    ...options,
  });
};

// In services/api/sessionApi.ts
export const sessionApi = {
  getAll: () => {
    return apiClient.get<Session[]>(SESSIONS_ENDPOINT);
  },
  // ...other methods
};
```

## Routing

The application uses React Router for navigation, with routes defined in a central `routes.tsx` file using the object-based route configuration:

```tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sessions",
    element: <SessionsListPage />,
  },
  // ...more routes
];
```

## State Management

Local component state is managed with React's useState and useReducer hooks. For global state that needs to be shared across components, Zustand is used.

## Error Handling

The application has a consistent error handling approach:

1. API errors are caught and transformed into standardized ApiError objects
2. React Query's error states are used to display error messages
3. Each component handles error states appropriately with user-friendly messages

## Next Steps

1. Add authentication/authorization
2. Implement proper form validation with a library like Zod
3. Add comprehensive testing with React Testing Library
4. Enhance accessibility features
5. Add proper error boundaries for fallback UI
6. Implement detailed documentation with Storybook
