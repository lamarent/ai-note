import { z } from "zod";

export const IdeaSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1).max(1000),
  sessionId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  upvotes: z.number().int().nonnegative().default(0),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateIdeaSchema = IdeaSchema.omit({
  id: true,
  upvotes: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateIdeaSchema = z.object({
  content: z.string().min(1).max(1000).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

export type Idea = z.infer<typeof IdeaSchema>;
export type CreateIdea = z.infer<typeof CreateIdeaSchema>;
export type UpdateIdea = z.infer<typeof UpdateIdeaSchema>;
