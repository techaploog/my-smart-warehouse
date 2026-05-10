export const API_RESPONSE_CODE = {
  SUCCESS: "SUCCESS",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ApiResponseCode = (typeof API_RESPONSE_CODE)[keyof typeof API_RESPONSE_CODE];

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type ApiResponseData = JsonObject | JsonArray;

export interface ApiResponse<TData extends ApiResponseData = ApiResponseData> {
  success: boolean;
  code: ApiResponseCode;
  data: TData;
}

export type ApiSuccessResponse<TData extends ApiResponseData = ApiResponseData> =
  ApiResponse<TData> & {
    success: true;
  };

export type ApiErrorResponse<TData extends JsonObject = JsonObject> = ApiResponse<TData> & {
  success: false;
};
