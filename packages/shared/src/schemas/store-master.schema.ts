import { z } from "zod";

export const createStoreMasterSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export const updateStoreMasterSchema = createStoreMasterSchema.omit({ code: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateStoreMasterDto = z.infer<typeof createStoreMasterSchema>;
export type UpdateStoreMasterDto = z.infer<typeof updateStoreMasterSchema>;

