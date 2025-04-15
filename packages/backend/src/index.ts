import { Hono } from "hono";

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
  // DATABASE_URL: string
  // OPENAI_API_KEY: string
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello AI Brainstorm Backend!");
});

app.get("/api", (c) => {
  return c.json({ message: "This is the AI Brainstorm API" });
});

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      message: `Route [${c.req.method}] ${c.req.path} not found.`,
    },
    404
  );
});

export default app;
