import { z } from "zod";

export const createItemSupplierSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export const updateItemSupplierSchema = createItemSupplierSchema.omit({ code: true }).partial();

export type CreateItemSupplierDto = z.infer<typeof createItemSupplierSchema>;
export type UpdateItemSupplierDto = z.infer<typeof updateItemSupplierSchema>;

