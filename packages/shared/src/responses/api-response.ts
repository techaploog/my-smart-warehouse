export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** Payload returned by handlers before the global interceptor wraps it */
export type ApiResponseData = JsonObject | JsonArray;

export interface ApiSuccessResponse<TData extends ApiResponseData = ApiResponseData> {
  success: true;
  data: TData;
}

export interface ApiErrorResponse<TError extends JsonObject = JsonObject> {
  success: false;
  error: TError;
}

export type ApiResponse<TData extends ApiResponseData = ApiResponseData> =
  | ApiSuccessResponse<TData>
  | ApiErrorResponse;
