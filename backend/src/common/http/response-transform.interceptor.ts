import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import {
  API_RESPONSE_CODE,
  type ApiResponse,
  type ApiResponseData,
  type JsonPrimitive,
} from "@warehouse/shared";
import type { FastifyReply } from "fastify";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiResponse> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse> {
    const response = context.switchToHttp().getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: API_RESPONSE_CODE.SUCCESS,
        data: normalizeSuccessData(data),
      })),
    );
  }
}

function normalizeSuccessData(data: unknown): ApiResponseData {
  if (data === undefined || data === null) {
    return {};
  }

  if (Array.isArray(data)) {
    return data as ApiResponseData;
  }

  if (typeof data === "object") {
    return data as ApiResponseData;
  }

  return { value: normalizePrimitive(data) };
}

function normalizePrimitive(data: unknown): JsonPrimitive {
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return data;
  }

  return String(data);
}
