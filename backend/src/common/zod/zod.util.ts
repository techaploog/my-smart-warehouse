import { BadRequestException } from "@nestjs/common";
import { ZodError, type ZodType, type ZodTypeDef } from "zod";

export { ZodValidationPipe, zodPipe } from "./zod-validation.pipe";

export function parseZod<T>(schema: ZodType<T, ZodTypeDef, unknown>, data: unknown): T {
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
