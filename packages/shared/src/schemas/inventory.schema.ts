import { z } from "zod";

export const adjustInventorySchema = z.object({
  productId: z.number().int().positive(),
  warehouseLocation: z.string().min(1, "Location is required"),
  quantity: z.number().int("Quantity must be an integer"),
  note: z.string().optional(),
});

export const inventoryQuerySchema = z.object({
  productId: z.number().int().positive().optional(),
  warehouseLocation: z.string().optional(),
});

export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>;
export type InventoryQueryDto = z.infer<typeof inventoryQuerySchema>;
