# Autonomous Development Workflow

## Development Cycle

### 1. Planning Phase

1. Update `context-tracking.md` with current task details
2. Review `project-plan.md` to understand task in broader context
3. Identify required knowledge and review/update `knowledge-base.md`
4. Create or update ADRs for any architectural decisions

### 2. Implementation Phase

1. For each feature or component:
   - Document the approach
   - Implement code changes
   - Run appropriate tests
   - Document any new knowledge gained
2. Follow the established patterns and conventions
3. Maintain type safety throughout implementation
4. Add appropriate documentation and comments

### 3. Review Phase

1. Ensure all changes are properly documented
2. Verify that code follows project standards
3. Check for potential edge cases or bugs
4. Update `context-tracking.md` with progress

### 4. Completion Phase

1. Mark task as completed in `project-plan.md`
2. Update `context-tracking.md` with completion status
3. Document lessons learned in `knowledge-base.md`
4. Provide a summary of changes made

## Working with Features

### Adding a New Feature

1. Document the feature in appropriate documentation
2. Create necessary types and schemas
3. Implement backend endpoints with proper validation
4. Implement frontend components and integration
5. Add tests as needed

### Modifying Existing Features

1. Understand current implementation from code and documentation
2. Make incremental changes while maintaining compatibility
3. Update tests and documentation

## Error Handling

- Log errors appropriately
- Provide helpful error messages
- Use Zod for validation to prevent invalid inputs

## Documentation Guidelines

- Document all public APIs and interfaces
- Update documentation alongside code changes
- Keep documentation concise and relevant
- Use markdown format for consistency
