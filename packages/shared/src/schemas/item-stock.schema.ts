import { z } from "zod";

export const createItemStockSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  itemSku: z.string().optional().nullable(),
  storeCode: z.string().optional().nullable(),
  qty: z.coerce.number().int().nonnegative().optional(),
  maxQty: z.coerce.number().int().nonnegative().optional(),
  minQty: z.coerce.number().int().nonnegative().optional(),
  reorderPoint: z.coerce.number().int().nonnegative().optional(),
  safetyStock: z.coerce.number().int().nonnegative().optional(),
  remarks: z.string().optional().nullable(),
});

export const updateItemStockSchema = createItemStockSchema.omit({ code: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateItemStockDto = z.infer<typeof createItemStockSchema>;
export type UpdateItemStockDto = z.infer<typeof updateItemStockSchema>;

