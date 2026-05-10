import { z } from "zod";

export const createItemCategorySchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1),
});

export const updateItemCategorySchema = createItemCategorySchema.pick({ name: true }).partial();

export type CreateItemCategoryDto = z.infer<typeof createItemCategorySchema>;
export type UpdateItemCategoryDto = z.infer<typeof updateItemCategorySchema>;

