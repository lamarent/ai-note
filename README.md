# AI Brainstorm

[![CI](https://github.com/yourusername/ai-brainstorm/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/yourusername/ai-brainstorm/actions/workflows/ci.yml)

An AI-powered brainstorming application that helps users generate, organize, and refine ideas.

## Overview

AI Brainstorm is a web application that leverages artificial intelligence to facilitate creative thinking and idea generation. Users can create brainstorming sessions, input initial ideas or topics, and get AI-powered suggestions to expand their thinking.

## Features

- Create and manage brainstorming sessions
- Generate AI-powered ideas and suggestions
- Organize ideas with categories and tags
- Hierarchical organization of related ideas
- Export brainstorming sessions to various formats

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, DaisyUI, Zustand, React Query
- **Backend**: Cloudflare Workers, Hono, Zod, Prisma
- **Database**: PostgreSQL
- **AI**: OpenAI GPT API

## Getting Started

### Prerequisites

- Node.js (v18+)
- PNPM (v8+)
- PostgreSQL
- A Cloudflare account (for deployment)
- OpenAI API key

### Development Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/ai-brainstorm.git
   cd ai-brainstorm
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Then edit the `.env` file with your database and API credentials.

4. Start the development servers:
   ```
   pnpm dev
   ```

For more detailed setup instructions, see the [Development Guide](docs/Development-Guide.md).

## Project Structure

This project follows a monorepo structure using PNPM workspaces:

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

## Documentation

- [MVP Plan](docs/MVP-Plan.md)
- [Architecture](docs/Architecture.md)
- [Features](docs/Features.md)
- [API Design](docs/API-Design.md)
- [UI Design](docs/UI-Design.md)
- [Development Guide](docs/Development-Guide.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their API
- All open-source libraries used in this project
