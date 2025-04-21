import { Hono } from "hono";
import { cors } from "hono/cors";
// import { zValidator } from "@hono/zod-validator"; // Unused import
import {
  // CreateSessionSchema, // Unused import
  // UpdateSessionSchema, // Unused import
  // CreateIdeaSchema,    // Unused import
  // UpdateIdeaSchema,    // Unused import
  // formatZodError,      // Unused import
  CreateSession,
  UpdateSession,
  CreateIdea,
  UpdateIdea,
} from "@ai-brainstorm/types";
import type { Context } from "hono";
import { D1Database } from "@cloudflare/workers-types";
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import categoryRoutes from "./routes/categories";
import ideaRoutes from "./routes/ideas";
import aiRoutes from "./routes/ai";

// Define the expected environment bindings
// See https://hono.dev/getting-started/cloudflare-workers#bindings
export type Env = {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace
  // Example binding to D1. Learn more at https://developers.cloudflare.com/workers/runtime-apis/d1/
  DB: D1Database;
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket
  // Example binding to AI Gateway. Learn more at https://developers.cloudflare.com/ai-gateway/
  // AI: Ai

  // OpenAI API configuration
  AI_API_KEY: string;
  AI_API_URL: string;
  AI_MODEL?: string;
};

// Define the combined shape of possible validated data
type ValidatedData = {
  json: CreateSession | UpdateSession | CreateIdea | UpdateIdea;
};

// Apply Env and the combined Schema shape to Hono instance
const app = new Hono<{ Bindings: Env }, ValidatedData>();

// Cloudflare Worker specific CORS configuration
app.use(
  "*",
  cors({
    origin: "*", // Adjust this to your specific frontend domain in production
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Key",
      "X-AI-Provider",
      "X-AI-Model",
    ],
  })
);

app.get("/", (c: Context<{ Bindings: Env }>) => {
  return c.text("Hello AI Brainstorm Backend!");
});

app.get("/api", (c: Context<{ Bindings: Env }>) => {
  return c.json({ message: "This is the AI Brainstorm API" });
});

// Mount all routes
app.route("/api/users", userRoutes);
app.route("/api/sessions", sessionRoutes);
app.route("/api/categories", categoryRoutes);
app.route("/api/ideas", ideaRoutes);
app.route("/api/ai", aiRoutes);

// Error handling
app.onError((error, c) => {
  console.error(`Global error handler: ${error}`);
  return c.json(
    { error: "An unexpected error occurred", message: error.message },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    { error: "Not found", message: "The requested resource was not found" },
    404
  );
});

export default app;
