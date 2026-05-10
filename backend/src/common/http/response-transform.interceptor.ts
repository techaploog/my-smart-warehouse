import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { type ApiResponse, type ApiResponseData, type JsonPrimitive } from "@warehouse/shared";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiResponse> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
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
