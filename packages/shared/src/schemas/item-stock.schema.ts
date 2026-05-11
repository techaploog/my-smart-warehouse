import { z } from "zod";

/** Path segment for `item_sku` when null (matches backend `stock/:storeCode/:code/:segment`). */
export const ITEM_SKU_PATH_SEGMENT_NONE = "_";

export function decodeItemSkuPathSegment(segment: string): string | null {
  if (segment === ITEM_SKU_PATH_SEGMENT_NONE) return null;
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function encodeItemSkuPathSegment(itemSku: string | null | undefined): string {
  if (itemSku == null || itemSku === "") return ITEM_SKU_PATH_SEGMENT_NONE;
  return encodeURIComponent(itemSku);
}

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

