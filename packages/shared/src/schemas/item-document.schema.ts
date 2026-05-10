import { z } from "zod";

export const createItemDocumentSchema = z.object({
  key: z.string().min(1).max(100),
  seq: z.coerce.number().int().nonnegative().optional(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.string().min(1).max(20).optional(),
  itemMasterId: z.string().optional().nullable(),
});

export const updateItemDocumentSchema = createItemDocumentSchema.omit({ key: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateItemDocumentDto = z.infer<typeof createItemDocumentSchema>;
export type UpdateItemDocumentDto = z.infer<typeof updateItemDocumentSchema>;

