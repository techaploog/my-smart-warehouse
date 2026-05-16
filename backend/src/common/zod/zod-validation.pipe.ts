import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodError, type ZodType, type ZodTypeDef } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T, ZodTypeDef, unknown>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value);
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
}

export function zodPipe<T>(schema: ZodType<T, ZodTypeDef, unknown>) {
  return new ZodValidationPipe(schema);
}
