# Development Checklists

Quick reference checklists for implementing common features and ensuring quality.

## Feature Implementation Checklist

### API Endpoint

- [ ] Define Zod schema for input validation
- [ ] Implement error handling
- [ ] Add appropriate HTTP status codes
- [ ] Write JSDoc comments
- [ ] Include authorization checks if needed
- [ ] Handle edge cases (empty result, invalid input)
- [ ] Ensure consistent response format
- [ ] Add logging for debugging

### React Component

- [ ] Define props interface with JSDoc comments
- [ ] Implement proper TypeScript typing
- [ ] Add error handling for data fetching
- [ ] Include loading states
- [ ] Consider accessibility (aria attributes, keyboard navigation)
- [ ] Implement responsive design
- [ ] Add data validation
- [ ] Optimize rendering performance

### Database Schema

- [ ] Define appropriate field types
- [ ] Add indexes for frequent queries
- [ ] Include timestamps (createdAt, updatedAt)
- [ ] Set up proper relations
- [ ] Add constraints (unique, required)
- [ ] Consider migration strategy
- [ ] Document schema purpose and relationships

## Quality Assurance Checklist

### Code Quality

- [ ] Follows project coding standards
- [ ] No TypeScript errors or warnings
- [ ] No ESLint warnings
- [ ] Proper error handling
- [ ] No hardcoded values (use environment variables)
- [ ] No commented-out code
- [ ] Consistent naming conventions

### Security

- [ ] Input validation with Zod
- [ ] Authentication checks on protected routes
- [ ] No sensitive data exposure
- [ ] Safe handling of user input
- [ ] No overly permissive CORS settings
- [ ] Proper error messages (no leaking internal details)

### Performance

- [ ] Optimized database queries
- [ ] Appropriate caching strategies
- [ ] Optimized React renders (useMemo, useCallback where appropriate)
- [ ] Lazy loading for large components
- [ ] Minimized network requests
- [ ] Optimized bundle size

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables defined
- [ ] Build successful locally
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Database migrations ready
- [ ] Performance tested

### Post-Deployment

- [ ] Verify application starts correctly
- [ ] Check logs for errors
- [ ] Verify critical paths manually
- [ ] Monitor performance metrics
- [ ] Confirm database migrations applied successfully
