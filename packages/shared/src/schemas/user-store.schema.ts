import { z } from "zod";

export const assignUserToStoreSchema = z.object({
  storeCode: z.string().min(1).max(20),
});

export type AssignUserToStoreDto = z.infer<typeof assignUserToStoreSchema>;
