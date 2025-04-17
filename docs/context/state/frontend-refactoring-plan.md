# Frontend Refactoring Plan

## Current Issues

- Lack of clear folder structure and organization
- Mixed responsibilities in components (e.g., data fetching within components)
- Inconsistent component organization and naming
- No clear pattern for UI components vs. container components
- No shared UI component library
- Duplication between similar components (SessionPage and EnhancedSessionPage)
- Large component files (EnhancedSessionPage.tsx with 600+ lines)
- No consistent error handling pattern
- No specific types folder
- No clear separation between pages and components

## Refactoring Goals

1. Improve folder structure following modern React best practices
2. Separate concerns (UI, state, API)
3. Create reusable UI components
4. Implement consistent error handling
5. Reduce component size and complexity
6. Establish common patterns for data fetching and state management
7. Improve type safety and organization

## New Directory Structure

```
src/
├── assets/            # Static assets like images, fonts
├── components/        # Reusable UI components
│   ├── common/        # Shared UI components (buttons, inputs, etc.)
│   ├── forms/         # Form components
│   ├── layout/        # Layout components (header, footer, etc.)
│   └── [feature]/     # Feature-specific components
├── config/            # Configuration files
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and libraries
├── pages/             # Page components (mapped to routes)
│   └── [feature]/     # Feature-specific pages
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

## Implementation Steps

1. **Setup Project Structure**

   - Create the new directory structure
   - Move existing files to appropriate locations
   - Update imports

2. **Create Common UI Components**

   - Extract reusable UI elements into common components
   - Create a Button component
   - Create a Card component
   - Create form input components
   - Create a Modal component
   - Create a notification/toast component

3. **Refactor API Integration**

   - Move API calls from components to dedicated service functions
   - Implement React Query hooks in a consistent pattern
   - Create error handling utilities

4. **Implement Feature-Based Organization**

   - Organize components by feature (sessions, ideas, categories)
   - Create feature-specific directories for complex features

5. **Create Page Components**

   - Move route components to pages directory
   - Simplify page components to focus on layout and composition

6. **Refactor State Management**

   - Standardize Zustand store pattern
   - Create separate stores for different domains
   - Implement proper TypeScript typing

7. **Implement Proper Error Handling**

   - Create consistent error boundary components
   - Implement form validation patterns
   - Add proper loading states

8. **Improve Type Safety**
   - Create comprehensive type definitions
   - Use proper typing for API responses
   - Implement zod schemas for validation

## Timeline and Approach

The refactoring will be done in phases to ensure the application remains functional throughout:

1. **Phase 1**: Setup new structure and move files (minimal changes to existing code)
2. **Phase 2**: Create common UI components and introduce them gradually
3. **Phase 3**: Refactor API integration and state management
4. **Phase 4**: Implement feature-based organization
5. **Phase 5**: Finalize error handling and type safety improvements

Each phase will include:

- Code changes
- Testing to ensure functionality
- Documentation updates
