# AI Brainstorm App Development Guide

This document provides instructions for setting up and developing the AI Brainstorm application.

## Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js** (v18 or later)
- **PNPM** (v8 or later)
- **Git**
- **PostgreSQL** (v14 or later)
- **Docker** (optional, for containerized development)

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-brainstorm.git
cd ai-brainstorm
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment variables file and update it with your values:

```bash
cp .env.example .env
```

Required environment variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_brainstorm

# OpenAI API (or alternative)
AI_API_KEY=your_api_key
AI_API_URL=https://api.openai.com/v1

# Cloudflare
CF_API_TOKEN=your_cloudflare_token
```

### 4. Set Up the Database

```bash
# Create the database
createdb ai_brainstorm

# Run migrations
pnpm db:migrate
```

## Project Structure

The application follows a monorepo structure using PNPM workspaces:

```
/
|-- packages/
|   |-- web/             # React Frontend
|   `-- worker/          # Cloudflare Worker Backend
|-- packages/
|   |-- ui/              # Shared UI components
|   |-- types/           # Shared TypeScript types
|   `-- config/          # Shared configurations
|-- docs/                # Project documentation
`-- scripts/             # Utility scripts
```

## Development Workflow

### Starting the Development Environment

Run the following command to start both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:

- Frontend at http://localhost:3000
- Backend at http://localhost:8787

### Running Individual Services

To run only the frontend:

```bash
pnpm --filter web dev
```

To run only the backend:

```bash
pnpm --filter worker dev
```

### Building for Production

To build all packages and applications:

```bash
pnpm build
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run frontend tests
pnpm --filter web test

# Run backend tests
pnpm --filter worker test
```

## Code Style and Linting

The project uses ESLint and Prettier for code style enforcement:

```bash
# Lint all code
pnpm lint

# Format all code
pnpm format
```

## Database Management

### Creating Migrations

```bash
pnpm db:migrate:create --name your_migration_name
```

### Applying Migrations

```bash
pnpm db:migrate
```

### Rolling Back Migrations

```bash
pnpm db:migrate:down
```

## AI Integration Setup

The application uses OpenAI's API for idea generation. To set up:

1. Create an account at [OpenAI](https://openai.com/)
2. Generate an API key
3. Add the key to your `.env` file as `AI_API_KEY`

## Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

```bash
pnpm --filter web build
# Deploy the dist folder from the web package
```

### Backend Deployment

The backend is designed to run on Cloudflare Workers:

```bash
pnpm --filter worker deploy
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Check that PostgreSQL is running
   - Verify connection string in `.env` file

2. **API Key Issues**

   - Ensure AI API key is valid and has sufficient credits
   - Check for proper environment variable setup

3. **Build Errors**
   - Run `pnpm clean` and then `pnpm install` to refresh dependencies
   - Check for TypeScript errors with `pnpm type-check`

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [project issues](https://github.com/yourusername/ai-brainstorm/issues)
2. Search for similar issues in the project documentation
3. Create a new issue with detailed information about the problem

## Contributing

See the [Contributing Guide](./CONTRIBUTING.md) for information on how to contribute to the project.

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Documentation](https://hono.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [DaisyUI Documentation](https://daisyui.com/docs/)
