import { z } from "zod";

export const createItemUnitSchema = z.object({
  code: z.string().min(1).max(20),
  details: z.string().optional().nullable(),
});

export const updateItemUnitSchema = createItemUnitSchema.omit({ code: true }).partial();

export type CreateItemUnitDto = z.infer<typeof createItemUnitSchema>;
export type UpdateItemUnitDto = z.infer<typeof updateItemUnitSchema>;

