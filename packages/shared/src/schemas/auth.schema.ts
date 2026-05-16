import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1),
});

export const jwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
  permissions: z.array(z.string()).default([]),
  branchs: z.array(z.string()).default([]),
  iat: z.number().int().positive(),
  exp: z.number().int().positive(),
});

export const loginResponseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  permissions: z.array(z.string()),
  branchs: z.array(z.string()),
  storeCodes: z.array(z.string()),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number().int().positive(),
  user: loginResponseUserSchema,
});

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;
export type JwtPayloadDto = z.infer<typeof jwtPayloadSchema>;
export type LoginResponseUserDto = z.infer<typeof loginResponseUserSchema>;
export type LoginResponseDto = z.infer<typeof loginResponseSchema>;
