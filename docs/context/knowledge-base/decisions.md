# Quick Decisions

This document tracks quick decisions made during development that don't warrant a full ADR but are still important to record.

## Frontend Decisions

| Date       | Decision                                  | Rationale                                           | Alternative Considered     | Impact                                  |
| ---------- | ----------------------------------------- | --------------------------------------------------- | -------------------------- | --------------------------------------- |
| 2023-08-28 | Use React Router v6 for routing           | Latest stable version with improved API             | Next.js App Router         | Simpler routing with familiar API       |
| 2023-08-28 | Use CSS modules with Tailwind             | Component-scoped styles with utility-first approach | Styled Components, Emotion | Better performance, smaller bundle size |
| 2023-08-28 | Use Vite's built-in environment variables | Simpler configuration                               | Dotenv                     | More consistent with Vite's conventions |
| 2023-08-28 | Group components by feature               | Better organization for feature development         | Group by component type    | Easier to find related components       |

## Backend Decisions

| Date       | Decision                                   | Rationale                                      | Alternative Considered         | Impact                                          |
| ---------- | ------------------------------------------ | ---------------------------------------------- | ------------------------------ | ----------------------------------------------- |
| 2023-08-28 | Use PostgreSQL for ACID compliance         | Data integrity is important                    | MongoDB                        | Better relational data handling                 |
| 2023-08-28 | Use connection pooling with Prisma         | Optimize connections in serverless environment | Direct connections             | Better performance, reduced connection overhead |
| 2023-08-28 | Implement custom error handling middleware | Consistent error responses                     | Hono's built-in error handling | More detailed error information                 |
| 2023-08-28 | Use zValidator for request validation      | Type-safe validation with Zod integration      | Manual validation              | Reduced boilerplate, better type safety         |

## API Decisions

| Date       | Decision                                | Rationale                      | Alternative Considered | Impact                                       |
| ---------- | --------------------------------------- | ------------------------------ | ---------------------- | -------------------------------------------- |
| 2023-08-28 | Use REST API style over GraphQL         | Simpler implementation for MVP | GraphQL                | Faster development, better caching           |
| 2023-08-28 | Implement versioning in API routes      | Future-proofing                | No versioning          | Easier to make breaking changes later        |
| 2023-08-28 | Use JWT for API authentication (future) | Stateless authentication       | Session-based auth     | Better scalability in serverless environment |

## Database Decisions

| Date       | Decision                         | Rationale                               | Alternative Considered       | Impact                                          |
| ---------- | -------------------------------- | --------------------------------------- | ---------------------------- | ----------------------------------------------- |
| 2023-08-28 | Use UUID for primary keys        | Distribute well in sharded environments | Auto-increment integers      | Better for distributed systems                  |
| 2023-08-28 | Implement soft deletes for ideas | Allow for recovery/undo                 | Hard deletes                 | Better user experience                          |
| 2023-08-28 | Store idea position as integer   | Simple reordering                       | Linked list, float positions | Easy implementation with occasional rebalancing |

## AI Integration Decisions

| Date       | Decision                            | Rationale                             | Alternative Considered | Impact                |
| ---------- | ----------------------------------- | ------------------------------------- | ---------------------- | --------------------- |
| 2023-08-28 | Use GPT-3.5-turbo as default model  | Good balance of quality and cost      | GPT-4                  | Lower operating costs |
| 2023-08-28 | Cache AI responses for 24 hours     | Reduce API costs for similar requests | No caching             | Lower operating costs |
| 2023-08-28 | Implement server-side AI calls only | Security of API keys                  | Client-side calls      | Better security       |

## DevOps Decisions

| Date       | Decision                            | Rationale                           | Alternative Considered  | Impact                          |
| ---------- | ----------------------------------- | ----------------------------------- | ----------------------- | ------------------------------- |
| 2023-08-28 | Use GitHub Actions for CI/CD        | Integrated with GitHub              | Jenkins, CircleCI       | Simpler setup, less maintenance |
| 2023-08-28 | Implement feature branch workflow   | Better isolation                    | Trunk-based development | Cleaner PR reviews              |
| 2023-08-28 | Deploy frontend to Cloudflare Pages | Integration with Cloudflare Workers | Vercel, Netlify         | Unified deployment platform     |

## Testing Decisions

| Date       | Decision                  | Rationale                          | Alternative Considered | Impact                           |
| ---------- | ------------------------- | ---------------------------------- | ---------------------- | -------------------------------- |
| 2023-08-28 | Use Jest for unit testing | Well-supported in React ecosystem  | Vitest                 | Familiar API, good documentation |
| 2023-08-28 | Use React Testing Library | Test behaviors, not implementation | Enzyme                 | More maintainable tests          |
| 2023-08-28 | Mock AI services in tests | Predictable test environment       | Real API calls         | Faster, more reliable tests      |

## 2024-04-29: Database Implementation with Prisma and Cloudflare D1

**Decision**: Use Prisma ORM with the D1 driver adapter for database access

**Context**:

- We need a database solution compatible with Cloudflare Workers
- We want type-safe database access with good developer experience
- We want to use a modern ORM that supports migrations and schema management

**Alternatives Considered**:

1. Direct D1 SQL queries
2. Drizzle ORM
3. TypeORM (limited support for edge)

**Reasons for Choice**:

- Prisma provides excellent TypeScript integration and type safety
- The D1 adapter allows seamless integration with Cloudflare Workers
- Prisma's schema-first approach aligns with our development philosophy
- Migrations can be managed using standard D1 migration tools

**Implementation Notes**:

- Created a separate `database` package in the monorepo
- Used the SQLite dialect for D1 compatibility
- Implemented a client factory function for use in Workers
- Created SQL migrations that can be applied with Wrangler

**Limitations/Risks**:

- Driver adapter for D1 is relatively new and may have limitations
- Need to maintain separate SQL migrations instead of using Prisma Migrate directly
- SQLite dialect limitations compared to PostgreSQL

---

_Last updated: 2025-04-15_
