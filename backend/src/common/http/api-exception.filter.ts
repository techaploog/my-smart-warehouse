import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { type ApiErrorResponse, type JsonObject } from "@warehouse/shared";
import type { FastifyReply } from "fastify";

type ExceptionResponse = string | object;

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorPayload =
      exception instanceof HttpException
        ? normalizeExceptionResponse(exception.getResponse())
        : ({ message: "Internal server error" } satisfies JsonObject);

    const body: ApiErrorResponse = {
      success: false,
      error: errorPayload,
    };

    response.status(status).send(body);
  }
}

function normalizeExceptionResponse(response: ExceptionResponse): JsonObject {
  if (typeof response === "string") {
    return { message: response };
  }

  const obj = { ...(response as Record<string, unknown>) };
  delete obj.statusCode;
  return obj as JsonObject;
}
