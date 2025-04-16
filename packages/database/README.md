# @ai-brainstorm/database

Database package for AI Note application using Prisma with Cloudflare D1.

## Setup

This package provides a Prisma client setup for Cloudflare D1 database using the driver adapter.

## Usage

```typescript
import { getPrismaClient } from "@ai-brainstorm/database";

// In a Cloudflare Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const prisma = await getPrismaClient(env.DB);

    // Use prisma client
    const users = await prisma.user.findMany();

    return new Response(JSON.stringify(users));
  },
};
```

## Available Scripts

- `npm run dev`: Generate Prisma client
- `npm run build`: Generate Prisma client
- `npm run migrate:create`: Create a new D1 migration
- `npm run migrate:apply:local`: Apply migrations to local D1 database
- `npm run migrate:apply:remote`: Apply migrations to remote D1 database
- `npm run generate:types`: Generate Cloudflare Worker types

## Models

The database schema includes the following models:

- `User`: Application users
- `Session`: Brainstorming sessions
- `Idea`: Individual ideas within a session
- `Category`: Grouping categories for ideas
