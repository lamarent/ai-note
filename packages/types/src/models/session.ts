import { z } from "zod";
import { CategorySchema } from "./category";

export const SessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  ownerId: z.string().uuid(),
  collaborators: z.array(z.string().uuid()).optional(),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  categories: z.array(CategorySchema).optional(),
});

export const CreateSessionSchema = SessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  categories: true,
});

export const UpdateSessionSchema = CreateSessionSchema.partial();

export type Session = z.infer<typeof SessionSchema>;
export type CreateSession = z.infer<typeof CreateSessionSchema>;
export type UpdateSession = z.infer<typeof UpdateSessionSchema>;
