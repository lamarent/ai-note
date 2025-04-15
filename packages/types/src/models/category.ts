import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  sessionId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>; 