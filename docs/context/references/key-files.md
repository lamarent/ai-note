# Key Files Reference

This document lists the most important files in the AI Brainstorm project with brief descriptions of their purpose and function.

## Root Configuration Files

| File | Description |
|------|-------------|
| `package.json` | Root package configuration with workspace setup and global scripts |
| `pnpm-workspace.yaml` | PNPM workspace configuration |
| `tsconfig.base.json` | Base TypeScript configuration with path aliases |
| `.env.example` | Example environment variables |
| `.gitignore` | Git ignore rules |

## Frontend (apps/web)

| File | Description |
|------|-------------|
| `apps/web/src/main.tsx` | Entry point for the frontend application |
| `apps/web/src/App.tsx` | Main App component with routing configuration |
| `apps/web/src/api/client.ts` | API client setup with React Query |
| `apps/web/src/store/index.ts` | Zustand store definitions |
| `apps/web/src/components/ui/index.ts` | UI component exports |
| `apps/web/src/pages/SessionList.tsx` | Session listing page |
| `apps/web/src/pages/SessionDetail.tsx` | Session detail page |

## Backend (apps/worker)

| File | Description |
|------|-------------|
| `apps/worker/src/index.ts` | Entry point for the Cloudflare Worker |
| `apps/worker/src/app.ts` | Main Hono application setup |
| `apps/worker/src/features/sessions/router.ts` | Sessions API routes |
| `apps/worker/src/features/ideas/router.ts` | Ideas API routes |
| `apps/worker/src/features/ai/router.ts` | AI integration routes |
| `apps/worker/src/middleware/error.ts` | Error handling middleware |
| `apps/worker/src/db.ts` | Prisma client initialization |
| `apps/worker/prisma/schema.prisma` | Prisma schema definition |

## Shared Packages

| File | Description |
|------|-------------|
| `packages/types/src/index.ts` | Shared TypeScript type exports |
| `packages/types/src/schemas.ts` | Zod schema definitions |
| `packages/ui/src/index.ts` | Shared UI component exports |
| `packages/config/eslint-preset.js` | Shared ESLint configuration |

## Documentation

| File | Description |
|------|-------------|
| `docs/README.md` | Main project documentation |
| `docs/MVP-Plan.md` | MVP development plan |
| `docs/Architecture.md` | System architecture overview |
| `docs/Features.md` | Feature specifications |
| `docs/API-Design.md` | API endpoint documentation |
| `docs/UI-Design.md` | UI design guidelines |
| `docs/Development-Guide.md` | Development setup instructions |
| `docs/ADR/001-tech-stack-selection.md` | ADR for technology stack choices |
| `docs/ADR/002-database-schema-design.md` | ADR for database schema design |
| `docs/ADR/003-ai-integration-approach.md` | ADR for AI integration approach |

## Context Tracking

| File | Description |
|------|-------------|
| `docs/context/development-log.md` | Chronological development activity log |
| `docs/context/state/current-focus.md` | Current development focus |
| `docs/context/state/blockers.md` | Current blockers and challenges |
| `docs/context/state/next-steps.md` | Planned next steps |
| `docs/context/knowledge-base/architecture.md` | Architecture notes and knowledge |
| `docs/context/knowledge-base/code-patterns.md` | Common code patterns |

## Scripts

| File | Description |
|------|-------------|
| `scripts/setup-db.sh` | Database setup script |
| `scripts/seed-db.js` | Database seeding script |
| `scripts/deploy.sh` | Deployment script |

---

*Last updated: 2023-08-28* 