import { Hono } from "hono";
import { getPrismaClient, IdeaRepository } from "@ai-brainstorm/database";
import { D1Database } from "@cloudflare/workers-types";
import { AIService } from "../services/ai";
import { CreateIdea } from "@ai-brainstorm/types";
import type { Context } from "hono";

type Bindings = {
  DB: D1Database;
  AI_API_KEY: string;
  AI_API_URL: string;
  AI_MODEL?: string;
};

// Define a type that matches exactly what IdeaRepository.create expects
interface DatabaseIdea {
  content: string;
  sessionId: string;
  position: { x: number; y: number };
  categoryId?: string | null;
  isAiGenerated?: boolean;
}

const ai = new Hono<{ Bindings: Bindings }>();

// Helper to create AI service instance
const getAIService = (c: Context<{ Bindings: Bindings }>): AIService => {
  // Attempt to read the API key from the request header
  const headerKey = c.req.header("X-API-Key") || c.req.header("x-api-key");
  const apiKey = headerKey ?? c.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API key is required (provide via X-API-Key header or env AI_API_KEY)"
    );
  }
  return new AIService({
    apiKey,
    apiUrl: c.env.AI_API_URL,
    model: c.env.AI_MODEL,
  });
};

// Helper to ensure idea has required fields for database
const prepareIdeaForDatabase = (idea: CreateIdea): DatabaseIdea => {
  return {
    content: idea.content,
    sessionId: idea.sessionId,
    position: idea.position || { x: 0, y: 0 },
    categoryId: idea.categoryId === undefined ? null : idea.categoryId,
    isAiGenerated: idea.isAiGenerated === undefined ? true : idea.isAiGenerated,
  };
};

// Generate ideas based on prompt
ai.post("/generate", async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, prompt, context, technique, count } = body;

    if (!sessionId || !prompt) {
      return c.json({ error: "Session ID and prompt are required" }, 400);
    }

    const aiService = getAIService(c);
    const generatedIdeas = await aiService.generateIdeas({
      sessionId,
      prompt,
      context,
      technique,
      count,
    });

    // Save generated ideas to database
    const prisma = await getPrismaClient(c.env.DB);
    const ideaRepo = new IdeaRepository(prisma);

    const savedIdeas = await Promise.all(
      generatedIdeas.map((idea) =>
        ideaRepo.create(prepareIdeaForDatabase(idea))
      )
    );

    return c.json(savedIdeas, 201);
  } catch (error) {
    console.error("Error generating ideas:", error);
    return c.json({ error: "Failed to generate ideas" }, 500);
  }
});

// Expand an existing idea
ai.post("/expand", async (c) => {
  try {
    const body = await c.req.json();
    const { ideaId, sessionId, depth = 1 } = body;

    if (!ideaId || !sessionId) {
      return c.json({ error: "Idea ID and Session ID are required" }, 400);
    }

    // Get the original idea
    const prisma = await getPrismaClient(c.env.DB);
    const ideaRepo = new IdeaRepository(prisma);
    const originalIdea = await ideaRepo.findById(ideaId);

    if (!originalIdea) {
      return c.json({ error: "Idea not found" }, 404);
    }

    // Generate expanded ideas
    const aiService = getAIService(c);
    const expandedIdeas = await aiService.expandIdea({
      ideaId,
      sessionId,
      idea: originalIdea.content,
      depth,
    });

    // Save expanded ideas to database
    const savedIdeas = await Promise.all(
      expandedIdeas.map((idea) => ideaRepo.create(prepareIdeaForDatabase(idea)))
    );

    return c.json(savedIdeas, 201);
  } catch (error) {
    console.error("Error expanding idea:", error);
    return c.json({ error: "Failed to expand idea" }, 500);
  }
});

// Get alternative perspectives on an idea
ai.post("/perspectives", async (c) => {
  try {
    const body = await c.req.json();
    const { ideaId, sessionId, count = 3 } = body;

    if (!ideaId || !sessionId) {
      return c.json({ error: "Idea ID and Session ID are required" }, 400);
    }

    // Get the original idea
    const prisma = await getPrismaClient(c.env.DB);
    const ideaRepo = new IdeaRepository(prisma);
    const originalIdea = await ideaRepo.findById(ideaId);

    if (!originalIdea) {
      return c.json({ error: "Idea not found" }, 404);
    }

    // Generate alternative perspectives
    const aiService = getAIService(c);
    const perspectives = await aiService.getAlternativePerspectives({
      ideaId,
      sessionId,
      idea: originalIdea.content,
      count,
    });

    // Save perspective ideas to database
    const savedIdeas = await Promise.all(
      perspectives.map((idea) => ideaRepo.create(prepareIdeaForDatabase(idea)))
    );

    return c.json(savedIdeas, 201);
  } catch (error) {
    console.error("Error generating perspectives:", error);
    return c.json({ error: "Failed to generate perspectives" }, 500);
  }
});

// Refine an idea
ai.post("/refine", async (c) => {
  try {
    const body = await c.req.json();
    const { ideaId, sessionId, instructions } = body;

    if (!ideaId || !sessionId || !instructions) {
      return c.json(
        {
          error: "Idea ID, Session ID, and instructions are required",
        },
        400
      );
    }

    // Get the original idea
    const prisma = await getPrismaClient(c.env.DB);
    const ideaRepo = new IdeaRepository(prisma);
    const originalIdea = await ideaRepo.findById(ideaId);

    if (!originalIdea) {
      return c.json({ error: "Idea not found" }, 404);
    }

    // Refine the idea
    const aiService = getAIService(c);
    const refinedIdea = await aiService.refineIdea({
      ideaId,
      sessionId,
      idea: originalIdea.content,
      instructions,
    });

    // Save refined idea to database
    const savedIdea = await ideaRepo.create(
      prepareIdeaForDatabase(refinedIdea)
    );

    return c.json(savedIdea, 201);
  } catch (error) {
    console.error("Error refining idea:", error);
    return c.json({ error: "Failed to refine idea" }, 500);
  }
});

// Validate API key endpoint
ai.post("/validate-key", (c) => {
  try {
    // Will throw if API key missing or invalid format
    getAIService(c);
    return c.json({ valid: true }, 200);
  } catch (error) {
    return c.json({ valid: false }, 401);
  }
});

export default ai;
