import { z } from "zod";

const moneySchema = z.coerce.number().nonnegative().transform((n) => n.toFixed(2));

export const createItemMasterSchema = z.object({
  sku: z.string().min(1).max(100),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  specification: z.string().optional().nullable(),
  unit: z.string().optional().nullable(),
  unitPrice: moneySchema.optional(),
  supplierId: z.string().optional().nullable(),
  buildOutAt: z.coerce.date().optional().nullable(),
  effectiveFrom: z.coerce.date().optional().nullable(),
  effectiveTo: z.coerce.date().optional().nullable(),
  orderLeadTime: z.coerce.number().int().nonnegative().optional(),
  remarks: z.string().optional().nullable(),
});

export const updateItemMasterSchema = createItemMasterSchema
  .omit({ sku: true })
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });

export type CreateItemMasterDto = z.infer<typeof createItemMasterSchema>;
export type UpdateItemMasterDto = z.infer<typeof updateItemMasterSchema>;

