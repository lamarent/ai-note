# Project Knowledge Base

## Project Structure

- Monorepo structure using PNPM workspaces
- Apps directory contains frontend (web) and backend (worker) applications
- Packages directory contains shared code
- Documentation in docs directory

### Frontend (web)

- React with Vite for build tooling
- UI using DaisyUI and Tailwind CSS
- State management with Zustand
- Data fetching using React Query
- Forms handling with React Hook Form

### Backend (worker)

- Cloudflare Workers as runtime
- Hono framework for API endpoints
- Zod for validation
- Prisma ORM with PostgreSQL

### Authentication

- Supabase Auth for identity management
- JWT verification in Hono middleware
- User ID mapping to Prisma database records

## Core Concepts

### API Design

- Hono RPC for type-safe endpoints
- Zod schemas for request/response validation
- Standardized error handling

### Database Schema

- Users table linked to Supabase auth via UUID
- [Other tables to be documented as they are created]

### State Management

- Zustand stores for global state
- React Query for server state

## Known Issues

[Document any known issues or limitations]

## Frequently Used Commands

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## External Resources

- [Hono Documentation](https://hono.dev/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [DaisyUI Documentation](https://daisyui.com/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)

## Environment Variables

[List all environment variables with descriptions]
