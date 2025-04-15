import { Hono } from "hono";
import { createPrismaClient } from "@ai-brainstorm/database";
import { zValidator } from "@hono/zod-validator";
import {
  CreateSessionSchema,
  UpdateSessionSchema,
  formatZodError,
  CreateSession,
  UpdateSession,
} from "@ai-brainstorm/types";
import type { Context } from "hono";

// Define the expected environment bindings
// See https://hono.dev/getting-started/cloudflare-workers#bindings
export type Env = {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace
  // Example binding to D1. Learn more at https://developers.cloudflare.com/workers/runtime-apis/d1/
  // DB: D1Database
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket
  // Example binding to AI Gateway. Learn more at https://developers.cloudflare.com/ai-gateway/
  // AI: Ai
  // Add your own bindings here, e.g., database URLs, API keys
  DATABASE_URL: string; // Ensure this is bound in wrangler.toml or Cloudflare dashboard
  // OPENAI_API_KEY: string
};

// Define the combined shape of possible validated data
type ValidatedData = {
  json: CreateSession | UpdateSession;
};

// Apply Env and the combined Schema shape to Hono instance
const app = new Hono<{ Bindings: Env }, ValidatedData>();

// Helper to get Prisma client per request (Cloudflare Worker best practice)
function getPrisma(c: Context<{ Bindings: Env }>) {
  return createPrismaClient(c.env.DATABASE_URL);
}

app.get("/", (c: Context<{ Bindings: Env }>) => {
  return c.text("Hello AI Brainstorm Backend!");
});

app.get("/api", (c: Context<{ Bindings: Env }>) => {
  return c.json({ message: "This is the AI Brainstorm API" });
});

// --- Session Routes ---

// GET /api/sessions - List all sessions
app.get("/api/sessions", async (c: Context<{ Bindings: Env }>) => {
  const prisma = getPrisma(c);
  try {
    const sessions = await prisma.session.findMany();
    return c.json(sessions);
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return c.json(
      { error: "Failed to fetch sessions", message: error.message },
      500
    );
  }
});

// GET /api/sessions/:id - Get a single session
app.get("/api/sessions/:id", async (c: Context<{ Bindings: Env }>) => {
  const prisma = getPrisma(c);
  const id = c.req.param("id");
  try {
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(session);
  } catch (error: any) {
    console.error(`Error fetching session ${id}:`, error);
    return c.json(
      { error: "Failed to fetch session", message: error.message },
      500
    );
  }
});

// POST /api/sessions - Create a new session
app.post(
  "/api/sessions",
  zValidator("json", CreateSessionSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          messages: formatZodError(result.error),
        },
        400
      );
    }
  }),
  async (c) => {
    const prisma = getPrisma(c);
    const createData = c.req.valid("json") as CreateSession;
    // TODO: Get ownerId from authentication context when implemented
    const ownerId = "00000000-0000-0000-0000-000000000000"; // Use valid UUID placeholder

    // Prepare data for Prisma
    const prismaData: any = {
      ...createData,
      ownerId: ownerId, // Use actual authenticated user ID
    };
    // If collaborators is present and is an array, map to connect format
    if (
      Array.isArray(createData.collaborators) &&
      createData.collaborators.length > 0
    ) {
      prismaData.collaborators = {
        connect: createData.collaborators.map((id) => ({ id })),
      };
    } else {
      delete prismaData.collaborators;
    }

    try {
      const newSession = await prisma.session.create({
        data: prismaData,
      });
      return c.json(newSession, 201);
    } catch (error: any) {
      console.error("Error creating session:", error);
      // Check for specific Prisma errors if needed (e.g., unique constraint violation)
      return c.json(
        { error: "Failed to create session", message: error.message },
        500
      );
    }
  }
);

// PUT /api/sessions/:id - Update an existing session
app.put(
  "/api/sessions/:id",
  zValidator("json", UpdateSessionSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          messages: formatZodError(result.error),
        },
        400
      );
    }
  }),
  async (c) => {
    const prisma = getPrisma(c);
    const id = c.req.param("id");
    const updateData = c.req.valid("json") as UpdateSession;

    // Prepare data for Prisma
    const prismaData: any = { ...updateData };
    // Remove ownerId if present (do not allow changing owner via update)
    delete prismaData.ownerId;
    // If collaborators is present and is an array, map to set/connect format
    if (Array.isArray(updateData.collaborators)) {
      prismaData.collaborators = {
        set: updateData.collaborators.map((id) => ({ id })),
      };
    } else {
      delete prismaData.collaborators;
    }

    // TODO: Add authorization check - ensure user owns the session or has permission

    try {
      const updatedSession = await prisma.session.update({
        where: { id },
        data: prismaData,
      });
      return c.json(updatedSession);
    } catch (error: any) {
      console.error(`Error updating session ${id}:`, error);
      if (error.code === "P2025") {
        // Prisma error code for record not found
        return c.json({ error: "Session not found" }, 404);
      }
      return c.json(
        { error: "Failed to update session", message: error.message },
        500
      );
    }
  }
);

// DELETE /api/sessions/:id - Delete a session
app.delete("/api/sessions/:id", async (c: Context<{ Bindings: Env }>) => {
  const prisma = getPrisma(c);
  const id = c.req.param("id");

  // TODO: Add authorization check - ensure user owns the session or has permission

  try {
    await prisma.session.delete({ where: { id } });
    return c.newResponse(null, 204); // No content on successful deletion
  } catch (error: any) {
    console.error(`Error deleting session ${id}:`, error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(
      { error: "Failed to delete session", message: error.message },
      500
    );
  }
});

// --- End Session Routes ---

// Error handling
app.onError((err, c: Context<{ Bindings: Env }>) => {
  console.error(`${err}`);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

// Not found handler
app.notFound((c: Context<{ Bindings: Env }>) => {
  return c.json(
    {
      error: "Not Found",
      message: `Route [${c.req.method}] ${c.req.path} not found.`,
    },
    404
  );
});

export default app;
