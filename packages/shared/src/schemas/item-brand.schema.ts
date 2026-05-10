import { z } from "zod";

export const createItemBrandSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1),
});

export const updateItemBrandSchema = createItemBrandSchema.pick({ name: true }).partial();

export type CreateItemBrandDto = z.infer<typeof createItemBrandSchema>;
export type UpdateItemBrandDto = z.infer<typeof updateItemBrandSchema>;

