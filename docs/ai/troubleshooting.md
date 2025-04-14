# Troubleshooting Guide

Quick solutions for common development issues to minimize debugging time.

## Frontend Issues

### React Query Cache Issues

**Symptoms:**

- Stale data being displayed
- Updates not reflecting immediately

**Solutions:**

- Check query invalidation:
  ```tsx
  queryClient.invalidateQueries({ queryKey: ["resource"] });
  ```
- Verify that mutation has proper `onSuccess` handling
- Try manual cache updates:
  ```tsx
  queryClient.setQueryData(["resource", id], newData);
  ```

### Component Rendering Issues

**Symptoms:**

- Component not updating when data changes
- Infinite re-renders
- Performance issues

**Solutions:**

- Check for missing dependency arrays in `useEffect`, `useMemo`, or `useCallback`
- Use React DevTools to inspect component re-renders
- Wrap expensive components with `React.memo()`
- Ensure proper key usage in lists

### State Management Issues

**Symptoms:**

- State updates not reflecting in UI
- Components out of sync

**Solutions:**

- Verify state is being updated correctly with the setter function
- Check for object reference issues (create new objects when updating state)
- Make sure you're not mutating state directly
- Consider using Zustand's `subscribe` for debugging:
  ```tsx
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.count,
      (count) => console.log("count changed to", count)
    );
    return unsubscribe;
  }, []);
  ```

## Backend Issues

### Prisma Database Issues

**Symptoms:**

- Database queries failing
- Schema sync errors
- Type errors with Prisma Client

**Solutions:**

- Run `npx prisma generate` to update Prisma Client
- Verify your database connection string in `.env`
- Check for missing migrations with `npx prisma migrate status`
- Try resetting the database in development with `npx prisma migrate reset`

### Hono API Issues

**Symptoms:**

- Endpoints returning 500 errors
- Middleware not working as expected
- Type errors with request/response

**Solutions:**

- Check for proper error handling in routes
- Verify that middleware is registered in the correct order
- Ensure Zod validation schemas match your data structure
- Add more detailed logging to identify the issue
  ```ts
  app.use("*", async (c, next) => {
    console.log(`Request: ${c.req.method} ${c.req.url}`);
    try {
      await next();
    } catch (e) {
      console.error("Unhandled error:", e);
      return c.json({ error: "Internal server error" }, 500);
    }
  });
  ```

### Authentication Issues

**Symptoms:**

- "Unauthorized" errors
- JWT validation failures
- Session persistence problems

**Solutions:**

- Check JWT expiration and refresh token logic
- Verify that your JWT secret is consistent
- Ensure cookies are being set with the correct domain and path
- Check CORS settings for cross-domain requests

## Build & Deployment Issues

### PNPM Workspace Issues

**Symptoms:**

- Package not found errors
- Dependency resolution problems
- Workspace commands failing

**Solutions:**

- Run `pnpm install` at the root to ensure all workspaces are installed
- Check `pnpm-workspace.yaml` for correct workspace paths
- Try clearing cache with `pnpm store prune`
- Verify package.json dependencies across workspaces

### Vite Build Issues

**Symptoms:**

- Build errors
- Missing environment variables
- Asset loading problems

**Solutions:**

- Check that all environment variables are defined in `.env`
- Verify import paths (case sensitivity matters)
- Try clearing the cache with `rm -rf node_modules/.vite`
- Check Vite configuration for proper plugin setup

### TypeScript Errors

**Symptoms:**

- Type errors during build
- Missing type definitions
- Incompatible types between modules

**Solutions:**

- Run `pnpm -r exec tsc --noEmit` to find all type errors
- Add missing type definitions with `pnpm add -D @types/package-name`
- Check for mismatched TypeScript versions across workspaces
- Use type assertions cautiously when necessary: `as Type`

## Testing Issues

### Jest/Vitest Test Failures

**Symptoms:**

- Tests failing inconsistently
- Mock functions not working as expected
- Timeout errors

**Solutions:**

- Check for async test issues (missing `await` or `done()` calls)
- Reset mocks between tests
- Isolate tests with proper setup/teardown
- Increase timeout for slow tests:
  ```ts
  jest.setTimeout(10000); // 10 seconds
  ```

## Performance Issues

**Symptoms:**

- Slow page loads
- UI lag
- High CPU/memory usage

**Solutions:**

- Use React DevTools Profiler to identify bottlenecks
- Check for unnecessary re-renders
- Implement virtualization for long lists
- Optimize API calls with proper caching
- Use code splitting and lazy loading for large components
