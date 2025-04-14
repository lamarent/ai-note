# Project Templates

Ready-to-use file templates for rapid project development.

## Configuration Files

### Root package.json

```json
{
  "name": "saas-boilerplate",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.6.0",
  "scripts": {
    "dev": "pnpm --filter './apps/**' dev",
    "build": "pnpm --filter './apps/**' build",
    "lint": "pnpm --filter './apps/**' lint",
    "test": "pnpm --filter './apps/**' test",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^13.2.2",
    "prettier": "^2.8.8",
    "typescript": "^5.1.3"
  },
  "lint-staged": {
    "*.{js,ts,tsx}": "eslint --cache --fix",
    "*.{js,ts,tsx,css,md}": "prettier --write"
  }
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  },
  "exclude": ["node_modules"]
}
```

### .env.example

```
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

# Authentication
JWT_SECRET="your-jwt-secret"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"

# Frontend
VITE_API_URL="http://localhost:8787"
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### .gitignore

```
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# build
dist
dist-ssr
*.local
.wrangler

# env
.env
.env.*
!.env.example

# editor
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# vercel
.vercel
```

### .eslintrc.js

```js
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  ignorePatterns: ["dist", ".eslintrc.js"],
  env: {
    browser: true,
    node: true,
  },
};
```

## Frontend Templates

### Vite Config (apps/web/vite.config.ts)

```ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8787",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: mode !== "production",
    },
  };
});
```

### Tailwind Config (apps/web/tailwind.config.js)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
```

### React App Entry (apps/web/src/main.tsx)

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### App Component (apps/web/src/App.tsx)

```tsx
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout";
import Loading from "./components/common/Loading";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Routes>
      <Route path="/auth">
        <Route
          path="login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="register"
          element={
            <Suspense fallback={<Loading />}>
              <Register />
            </Suspense>
          }
        />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          }
        />
        {/* Add more authenticated routes here */}
      </Route>

      <Route
        path="*"
        element={
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
```

## Backend Templates

### Cloudflare Worker Configuration (apps/worker/wrangler.toml)

```toml
name = "saas-api"
main = "src/index.ts"
compatibility_date = "2023-06-01"

# Database binding
[[d1_databases]]
binding = "DB"
database_name = "saas-db"
database_id = "your-database-id"

# KV namespace
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

# Environment variables
[vars]
JWT_SECRET = "development-secret"

# Development environment
[env.development]
vars = { JWT_SECRET = "development-secret" }

# Production environment
[env.production]
vars = { JWT_SECRET = "replace-in-production" }
```

### Main Worker Entry (apps/worker/src/index.ts)

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { PrismaClient } from "@prisma/client";

// Import feature routes
import authRoutes from "./features/auth";
import userRoutes from "./features/users";

// Initialize Prisma
export const prisma = new PrismaClient();

// Create Hono app
const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.route("/auth", authRoutes);
app.route("/users", userRoutes);

// Health check
app.get("/", (c) => c.json({ status: "ok" }));

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`${c.req.method} ${c.req.url}`, err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
```

### Prisma Schema (apps/worker/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  authId        String    @unique // Supabase auth UID
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // Relations
  profile       Profile?
}

model Profile {
  id            String    @id @default(uuid())
  bio           String?
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // Relations
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Shared Package Templates

### Type Definitions (packages/types/src/index.ts)

```ts
import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).optional(),
});

export type RegisterCredentials = z.infer<typeof registerSchema>;

// API response schemas
export const apiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
};
```

### UI Component Package (packages/ui/package.json)

```json
{
  "name": "@saas/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.2",
    "daisyui": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.12",
    "@types/react-dom": "^18.2.5",
    "typescript": "^5.1.3"
  }
}
```

### UI Component Index (packages/ui/src/index.ts)

```ts
// Export all components
export * from "./Button";
export * from "./Card";
export * from "./Input";
export * from "./Modal";
export * from "./Table";
export * from "./Typography";
```

## Documentation Templates

### Component Documentation Template

````md
# Component Name

## Overview

Brief description of the component.

## Props

| Name     | Type      | Default | Description          |
| -------- | --------- | ------- | -------------------- |
| prop1    | string    | -       | Description of prop1 |
| prop2    | number    | 0       | Description of prop2 |
| children | ReactNode | -       | Child elements       |

## Usage

```tsx
import { ComponentName } from "@/components/ComponentName";

function MyComponent() {
  return (
    <ComponentName prop1="value" prop2={42}>
      Content
    </ComponentName>
  );
}
```
````

## Variants

### Primary Variant

Description and example of the primary variant.

### Secondary Variant

Description and example of the secondary variant.

## Accessibility

Accessibility considerations for this component.

## Notes

Additional information about the component.

````

### API Endpoint Documentation Template

```md
# Resource Name API

## Endpoints

### GET /resource
Retrieve a list of resources.

#### Query Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| limit | number | No | Maximum number of items to return |
| offset | number | No | Number of items to skip |

#### Response
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "createdAt": "date"
    }
  ]
}
````

### GET /resource/:id

Retrieve a specific resource by ID.

#### Path Parameters

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| id   | string | Yes      | Resource ID |

#### Response

```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### POST /resource

Create a new resource.

#### Request Body

```json
{
  "name": "string",
  "description": "string"
}
```

#### Response

```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### PUT /resource/:id

Update an existing resource.

#### Path Parameters

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| id   | string | Yes      | Resource ID |

#### Request Body

```json
{
  "name": "string",
  "description": "string"
}
```

#### Response

```json
{
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### DELETE /resource/:id

Delete a resource.

#### Path Parameters

| Name | Type   | Required | Description |
| ---- | ------ | -------- | ----------- |
| id   | string | Yes      | Resource ID |

#### Response

```json
{
  "success": true
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

```

```
