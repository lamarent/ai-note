# Code Templates

These templates provide standardized implementations for common patterns in the project to accelerate development.

## Frontend

### React Component Template

```tsx
import React from "react";

interface Props {
  // Define props here
}

/**
 * Component description
 */
export const ComponentName: React.FC<Props> = (
  {
    /* destructure props */
  }
) => {
  // Component logic

  return <div className="container">{/* Component content */}</div>;
};
```

### Zustand Store Template

```tsx
import { create } from "zustand";

interface StoreState {
  // State properties
  count: number;

  // Actions
  increment: () => void;
  decrement: () => void;
}

export const useStore = create<StoreState>((set) => ({
  // Initial state
  count: 0,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### React Query Hook Template

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

// Query hook
export const useResourceQuery = (id?: string) => {
  return useQuery({
    queryKey: ["resource", id],
    queryFn: () => api.getResource(id),
    enabled: !!id,
  });
};

// Mutation hook
export const useResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource"] });
    },
  });
};
```

### Form Template with React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define schema
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export const FormTemplate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          {...register("name")}
          className="input input-bordered"
        />
        {errors.name && (
          <span className="text-error">{errors.name.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          {...register("email")}
          className="input input-bordered"
        />
        {errors.email && (
          <span className="text-error">{errors.email.message}</span>
        )}
      </div>

      <button type="submit" className="btn btn-primary mt-4">
        Submit
      </button>
    </form>
  );
};
```

## Backend

### Hono API Endpoint Template

```ts
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../db";

const app = new Hono();

// Request schema
const createItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

// Get all items
app.get("/", async (c) => {
  try {
    const items = await prisma.item.findMany();
    return c.json({ items });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

// Get item by ID
app.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return c.json({ error: "Item not found" }, 404);
    }

    return c.json({ item });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch item" }, 500);
  }
});

// Create new item
app.post("/", zValidator("json", createItemSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const newItem = await prisma.item.create({
      data,
    });

    return c.json({ item: newItem }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create item" }, 500);
  }
});

export default app;
```

### Prisma Schema Template

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // Relations
  items     Item[]
}

model Item {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

### JWT Authentication Middleware

```ts
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { prisma } from "../db";

// JWT middleware
export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET as string,
});

// User context middleware
export const userContext = async (c, next) => {
  const payload = c.get("jwtPayload");
  const userId = payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    c.set("user", user);
    await next();
  } catch (error) {
    console.error(error);
    return c.json({ error: "Authentication failed" }, 500);
  }
};

// Usage
const app = new Hono();

// Protected routes
app.use("/api/*", authMiddleware);
app.use("/api/*", userContext);
```
