# Troubleshooting Guide

This document contains common issues encountered during development of the AI Brainstorm app and their solutions.

## Environment Setup Issues

### PNPM Workspace Not Recognizing Packages

**Issue**: Packages in the monorepo aren't being recognized by other packages.

**Solution**:

1. Ensure `pnpm-workspace.yaml` is correctly configured
2. Run `pnpm install` from the root directory
3. Check that package.json files have the correct names

```bash
# Example fix
# 1. In root directory
pnpm install
# 2. If still not working, clean cache
pnpm store prune
pnpm install
```

### TypeScript Path Aliases Not Working

**Issue**: TypeScript path aliases defined in tsconfig.base.json aren't being resolved.

**Solution**:

1. Make sure your package tsconfig.json extends the base config
2. Restart the TypeScript server in your editor
3. Ensure your build tools are configured to respect the paths

```json
// In your package tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // Package-specific options
  }
}
```

## Frontend Issues

### React Query Not Refetching Data

**Issue**: After mutations, React Query isn't automatically refetching data.

**Solution**:

1. Ensure you're invalidating the correct query keys
2. Check that your mutation's onSuccess callback is being triggered
3. Verify your query key structure is consistent

```typescript
// Correct invalidation
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createSession,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  },
});
```

### CSS/Styling Not Applied

**Issue**: TailwindCSS classes not being applied or styles not showing up.

**Solution**:

1. Check if Tailwind is properly configured in the project
2. Ensure the class names are correct (check for typos)
3. If using CSS modules, make sure they're properly imported
4. Check browser console for CSS errors

```bash
# Rebuild Tailwind if needed
npx tailwindcss -i ./src/styles/input.css -o ./src/styles/output.css --watch
```

## Backend Issues

### Prisma Client Generation Failing

**Issue**: Unable to generate Prisma client or getting errors during generation.

**Solution**:

1. Verify your Prisma schema is valid
2. Check database URL in .env file
3. Make sure the database exists and is accessible
4. Run Prisma commands with debugging

```bash
# Validate schema
npx prisma validate

# Generate with debug logs
npx prisma generate --verbose

# Reset database if needed
npx prisma migrate reset
```

### Cloudflare Worker Deployment Issues

**Issue**: Unable to deploy or errors during deployment to Cloudflare Workers.

**Solution**:

1. Check your wrangler.toml configuration
2. Verify Cloudflare API token has correct permissions
3. Ensure worker size is within Cloudflare limits
4. Check for unsupported Node.js APIs

```bash
# Check wrangler configuration
npx wrangler config

# Validate before deploying
npx wrangler publish --dry-run

# Deploy with more logs
npx wrangler publish --verbose
```

## Database Issues

### Prisma Migrations Not Working

**Issue**: Unable to create or apply Prisma migrations.

**Solution**:

1. Check database connection URL
2. Ensure database user has sufficient permissions
3. Look for conflicting migration history
4. Try resetting the migration history if in development

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# If stuck, reset (DEV ONLY!)
npx prisma migrate reset
```

### Connection Pooling Issues with Serverless

**Issue**: Database connections are being exhausted in serverless environment.

**Solution**:

1. Implement connection pooling (e.g., PgBouncer)
2. Ensure connections are properly closed after use
3. Add retry logic for connection errors
4. Consider a managed database service with built-in pooling

## AI Integration Issues

### OpenAI API Rate Limits

**Issue**: Hitting rate limits when making requests to OpenAI API.

**Solution**:

1. Implement exponential backoff and retry logic
2. Add request caching for identical prompts
3. Batch requests where possible
4. Monitor and adjust token usage

```typescript
// Implementing retry logic
const fetchWithRetry = async (prompt, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited, wait and retry
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries exceeded");
};
```

### AI Response Formatting Issues

**Issue**: AI responses not following expected format for parsing.

**Solution**:

1. Use more explicit prompts with format instructions
2. Implement response validation and retry with clearer instructions
3. Add fallback parsing for different response formats
4. Consider using function calling for structured outputs

## Testing Issues

### Mock API Responses

**Issue**: Difficulty mocking API calls in tests.

**Solution**:

1. Use Jest's mock functions for fetch or axios
2. Create a mock service worker for API requests
3. Set up mock response fixtures
4. Ensure your test setup restores mocks properly

```typescript
// Mocking fetch in Jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ sessions: [] }),
    ok: true,
  })
) as jest.Mock;
```

### Component Testing Errors

**Issue**: React component tests failing with various errors.

**Solution**:

1. Ensure components are wrapped with necessary providers (QueryClient, Router, etc.)
2. Mock hooks and context that the component depends on
3. Use `act()` for state updates when needed
4. Check for async operations that need to be awaited

---

_Last updated: 2025-04-15_
