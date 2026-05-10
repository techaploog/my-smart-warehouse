import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import {
  API_RESPONSE_CODE,
  type ApiErrorResponse,
  type ApiResponseCode,
  type JsonObject,
} from "@warehouse/shared";
import type { FastifyReply } from "fastify";

type ExceptionResponse = string | object;

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const data =
      exception instanceof HttpException
        ? normalizeExceptionResponse(exception.getResponse())
        : { message: "Internal server error" };

    const body: ApiErrorResponse = {
      success: false,
      code: getResponseCode(status, data),
      data,
    };

    response.status(status).send(body);
  }
}

function normalizeExceptionResponse(response: ExceptionResponse): JsonObject {
  if (typeof response === "string") {
    return { message: response };
  }

  const { statusCode: _statusCode, ...data } = response as Record<string, unknown>;
  return data as JsonObject;
}

function getResponseCode(status: number, data: JsonObject): ApiResponseCode {
  if (status === HttpStatus.BAD_REQUEST && Array.isArray(data.issues)) {
    return API_RESPONSE_CODE.VALIDATION_ERROR;
  }

  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return API_RESPONSE_CODE.BAD_REQUEST;
    case HttpStatus.UNAUTHORIZED:
      return API_RESPONSE_CODE.UNAUTHORIZED;
    case HttpStatus.FORBIDDEN:
      return API_RESPONSE_CODE.FORBIDDEN;
    case HttpStatus.NOT_FOUND:
      return API_RESPONSE_CODE.NOT_FOUND;
    case HttpStatus.CONFLICT:
      return API_RESPONSE_CODE.CONFLICT;
    default:
      return API_RESPONSE_CODE.INTERNAL_ERROR;
  }
}
