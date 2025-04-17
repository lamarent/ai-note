import { Hono } from "hono";
import { getPrismaClient, IdeaRepository } from "@ai-brainstorm/database";
import { D1Database } from "@cloudflare/workers-types";
import { CreateIdeaSchema, UpdateIdeaSchema } from "@ai-brainstorm/types";
import { validateWithErrors, formatZodError } from "@ai-brainstorm/types";

type Bindings = {
  DB: D1Database;
};

const ideas = new Hono<{ Bindings: Bindings }>();

// Get all ideas
ideas.get("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);
  try {
    const ideas = await ideaRepo.findAll();
    return c.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return c.json({ error: "Failed to fetch ideas" }, 500);
  }
});

// Get ideas by session ID
ideas.get("/session/:sessionId", async (c) => {
  const sessionId = c.req.param("sessionId");
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const ideas = await ideaRepo.findBySessionId(sessionId);
    return c.json(ideas);
  } catch (error) {
    console.error(`Error fetching ideas for session ${sessionId}:`, error);
    return c.json({ error: "Failed to fetch session ideas" }, 500);
  }
});

// Get ideas by category ID
ideas.get("/category/:categoryId", async (c) => {
  const categoryId = c.req.param("categoryId");
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const ideas = await ideaRepo.findByCategoryId(categoryId);
    return c.json(ideas);
  } catch (error) {
    console.error(`Error fetching ideas for category ${categoryId}:`, error);
    return c.json({ error: "Failed to fetch category ideas" }, 500);
  }
});

// Get idea by id
ideas.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const idea = await ideaRepo.findById(id);
    if (!idea) {
      return c.json({ error: "Idea not found" }, 404);
    }
    return c.json(idea);
  } catch (error) {
    console.error(`Error fetching idea ${id}:`, error);
    return c.json({ error: "Failed to fetch idea" }, 500);
  }
});

// Create a new idea
ideas.post("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(CreateIdeaSchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const { position = { x: 0, y: 0 }, ...restData } = validation.data!;

    // Create with required position object
    const ideaData = {
      ...restData,
      position: position,
    };

    const idea = await ideaRepo.create(ideaData);
    return c.json(idea, 201);
  } catch (error) {
    console.error("Error creating idea:", error);
    return c.json({ error: "Failed to create idea" }, 500);
  }
});

// Update an idea
ideas.put("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(UpdateIdeaSchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const updated = await ideaRepo.update(id, validation.data!);
    if (!updated) {
      return c.json({ error: "Idea not found" }, 404);
    }
    return c.json(updated);
  } catch (error) {
    console.error(`Error updating idea ${id}:`, error);
    return c.json({ error: "Failed to update idea" }, 500);
  }
});

// Delete an idea
ideas.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const ideaRepo = new IdeaRepository(prisma);

  try {
    const deleted = await ideaRepo.delete(id);
    if (!deleted) {
      return c.json({ error: "Idea not found" }, 404);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error deleting idea ${id}:`, error);
    return c.json({ error: "Failed to delete idea" }, 500);
  }
});

export default ideas;
