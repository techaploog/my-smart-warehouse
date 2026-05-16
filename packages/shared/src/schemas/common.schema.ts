import { z } from "zod";

export const uuidParamSchema = z.string().uuid();
export const idParamSchema = z.string().min(1);
export const storeCodeParamSchema = z.string().min(1).max(20);
export const activeStateSchema = z.object({ isActive: z.boolean() });

export type ActiveStateDto = z.infer<typeof activeStateSchema>;
