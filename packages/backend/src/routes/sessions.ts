import { Hono } from "hono";
import { getPrismaClient, SessionRepository } from "@ai-brainstorm/database";
import { D1Database } from "@cloudflare/workers-types";
import { CreateSessionSchema, UpdateSessionSchema } from "@ai-brainstorm/types";
import { validateWithErrors, formatZodError } from "@ai-brainstorm/types";

type Bindings = {
  DB: D1Database;
};

const sessions = new Hono<{ Bindings: Bindings }>();

// Get all sessions
sessions.get("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);
  try {
    const sessions = await sessionRepo.findAll();
    return c.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: "Failed to fetch sessions" }, 500);
  }
});

// Get sessions by owner ID
sessions.get("/user/:ownerId", async (c) => {
  const ownerId = c.req.param("ownerId");
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);

  try {
    const sessions = await sessionRepo.findByOwnerId(ownerId);
    return c.json(sessions);
  } catch (error) {
    console.error(`Error fetching sessions for user ${ownerId}:`, error);
    return c.json({ error: "Failed to fetch user sessions" }, 500);
  }
});

// Get session by id
sessions.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);

  try {
    const session = await sessionRepo.findById(id);
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(session);
  } catch (error) {
    console.error(`Error fetching session ${id}:`, error);
    return c.json({ error: "Failed to fetch session" }, 500);
  }
});

// Create a new session
sessions.post("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(CreateSessionSchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const { collaborators, ...sessionData } = validation.data!;

    // Transform collaborators from string[] to Prisma's expected format
    const sessionPayload = {
      ...sessionData,
      ...(collaborators && collaborators.length > 0
        ? {
            collaborators: {
              connect: collaborators.map((id) => ({ id })),
            },
          }
        : {}),
    };

    const session = await sessionRepo.create(sessionPayload);
    return c.json(session, 201);
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ error: "Failed to create session" }, 500);
  }
});

// Update a session
sessions.put("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(UpdateSessionSchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const { collaborators, ...sessionData } = validation.data!;

    // Transform collaborators from string[] to Prisma's expected format
    const sessionPayload = {
      ...sessionData,
      ...(collaborators && collaborators.length > 0
        ? {
            collaborators: {
              connect: collaborators.map((id) => ({ id })),
            },
          }
        : {}),
    };

    const updated = await sessionRepo.update(id, sessionPayload);
    if (!updated) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json(updated);
  } catch (error) {
    console.error(`Error updating session ${id}:`, error);
    return c.json({ error: "Failed to update session" }, 500);
  }
});

// Delete a session
sessions.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const sessionRepo = new SessionRepository(prisma);

  try {
    const deleted = await sessionRepo.delete(id);
    if (!deleted) {
      return c.json({ error: "Session not found" }, 404);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error deleting session ${id}:`, error);
    return c.json({ error: "Failed to delete session" }, 500);
  }
});

export default sessions;
