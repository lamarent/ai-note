# Backend Package

This package provides the API backend using Cloudflare Workers with Hono framework and D1 database.

## Features

- Cloudflare Workers serverless architecture
- Hono framework for routing and middleware
- Prisma ORM with Cloudflare D1 for database access
- Zod for request validation

## Prerequisites

- Cloudflare account
- Wrangler CLI installed
- D1 database set up (see database package README)

## Getting Started

1. Make sure you have set up the database package first:

   ```bash
   cd ../database
   pnpm setup
   ```

2. Start the development server:

   ```bash
   pnpm dev
   ```

   This will start the Wrangler dev server with a local D1 instance.

## API Endpoints

- `GET /api/sessions`: List all sessions
- `GET /api/sessions/:id`: Get a specific session
- `POST /api/sessions`: Create a new session
- `PUT /api/sessions/:id`: Update a session
- `DELETE /api/sessions/:id`: Delete a session

## Testing in Development

The local development server will be available at: http://localhost:8787

You can test the API using tools like curl, Postman, or Insomnia:

```bash
# Example: List all sessions
curl http://localhost:8787/api/sessions

# Example: Create a new session
curl -X POST http://localhost:8787/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"title": "My Session", "description": "A test session"}'
```

## Deployment

To deploy to Cloudflare Workers:

```bash
pnpm deploy
```

This will deploy your API to your Cloudflare Workers account.

## Environment Variables

The following environment variables can be configured in your wrangler.toml:

- Any custom environment variables go here

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
