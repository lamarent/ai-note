import { Hono } from "hono";
import { getPrismaClient, UserRepository } from "@ai-brainstorm/database";
import { D1Database } from "@cloudflare/workers-types";

type Bindings = {
  DB: D1Database;
};

const users = new Hono<{ Bindings: Bindings }>();

// Get all users
users.get("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const userRepo = new UserRepository(prisma);
  try {
    const users = await userRepo.findAll();
    return c.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// Get user by id
users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const userRepo = new UserRepository(prisma);

  try {
    const user = await userRepo.findById(id);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json(user);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

// Create a new user
users.post("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const userRepo = new UserRepository(prisma);

  try {
    const { email, name } = await c.req.json();
    const user = await userRepo.create({
      email,
      // Ensure name is compatible with the schema
      name: name || "",
    });
    return c.json(user, 201);
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

export default users;
