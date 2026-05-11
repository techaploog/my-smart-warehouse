import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { type ApiErrorResponse, type JsonObject } from "@warehouse/shared";
import { PinoLogger } from "nestjs-pino";
import type { FastifyReply } from "fastify";

type ExceptionResponse = string | object;

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(ApiExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<{ method?: string; url?: string; id?: string }>();
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorPayload =
      exception instanceof HttpException
        ? normalizeExceptionResponse(exception.getResponse())
        : ({ message: "Internal server error" } satisfies JsonObject);

    const err =
      exception instanceof Error
        ? { type: exception.name, message: exception.message, stack: exception.stack }
        : { type: typeof exception, value: exception };

    const logPayload = {
      requestId: request?.id,
      method: request?.method,
      path: request?.url,
      statusCode: status,
      err,
    };

    if (status >= 500) {
      this.logger.error(logPayload, "Unhandled exception");
    } else if (status >= 400) {
      this.logger.warn(logPayload, "Request failed");
    }

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
