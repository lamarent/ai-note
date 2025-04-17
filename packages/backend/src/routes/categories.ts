import { Hono } from "hono";
import { getPrismaClient, CategoryRepository } from "@ai-brainstorm/database";
import { D1Database } from "@cloudflare/workers-types";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@ai-brainstorm/types";
import { validateWithErrors, formatZodError } from "@ai-brainstorm/types";

type Bindings = {
  DB: D1Database;
};

const categories = new Hono<{ Bindings: Bindings }>();

// Get all categories
categories.get("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const categoryRepo = new CategoryRepository(prisma);
  try {
    const categories = await categoryRepo.findAll();
    return c.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories" }, 500);
  }
});

// Get category by id
categories.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const categoryRepo = new CategoryRepository(prisma);

  try {
    const category = await categoryRepo.findById(id);
    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }
    return c.json(category);
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return c.json({ error: "Failed to fetch category" }, 500);
  }
});

// Create a new category
categories.post("/", async (c) => {
  const prisma = await getPrismaClient(c.env.DB);
  const categoryRepo = new CategoryRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(CreateCategorySchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const category = await categoryRepo.create(validation.data!);
    return c.json(category, 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return c.json({ error: "Failed to create category" }, 500);
  }
});

// Update a category
categories.put("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const categoryRepo = new CategoryRepository(prisma);

  try {
    const body = await c.req.json();
    const validation = validateWithErrors(UpdateCategorySchema, body);

    if (!validation.success) {
      return c.json(
        {
          error: "Validation failed",
          details: formatZodError(validation.errors!),
        },
        400
      );
    }

    const updated = await categoryRepo.update(id, validation.data!);
    if (!updated) {
      return c.json({ error: "Category not found" }, 404);
    }
    return c.json(updated);
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    return c.json({ error: "Failed to update category" }, 500);
  }
});

// Delete a category
categories.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = await getPrismaClient(c.env.DB);
  const categoryRepo = new CategoryRepository(prisma);

  try {
    const deleted = await categoryRepo.delete(id);
    if (!deleted) {
      return c.json({ error: "Category not found" }, 404);
    }
    return c.json({ success: true });
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return c.json({ error: "Failed to delete category" }, 500);
  }
});

export default categories;
