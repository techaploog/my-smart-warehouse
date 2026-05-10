import { BadRequestException } from "@nestjs/common";
import { ZodError, type ZodSchema } from "zod";

export function parseZod<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new BadRequestException({
        message: "Validation failed",
        issues: err.issues,
      });
    }
    throw err;
  }
}
