import { z } from "zod";

export const createItemImageSchema = z.object({
  key: z.string().min(1).max(100),
  seq: z.coerce.number().int().nonnegative().optional(),
  itemMasterId: z.string().optional().nullable(),
});

export const updateItemImageSchema = createItemImageSchema.omit({ key: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateItemImageDto = z.infer<typeof createItemImageSchema>;
export type UpdateItemImageDto = z.infer<typeof updateItemImageSchema>;

