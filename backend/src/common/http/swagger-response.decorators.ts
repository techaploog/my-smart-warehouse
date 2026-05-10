import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from "@nestjs/swagger";
import { PaginatedListDataDoc } from "./api-response.swagger";

function ApiPaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      description: "1-based page index (default 1)",
      example: 1,
    }),
    ApiQuery({
      name: "pageSize",
      required: false,
      type: Number,
      description: "Items per page, max 100 (default 20)",
      example: 20,
    }),
  );
}

export const apiSuccessEnvelopeSchema = {
  type: "object" as const,
  required: ["success", "data"],
  properties: {
    success: { type: "boolean" as const, example: true },
    data: {
      oneOf: [
        { type: "object" as const, additionalProperties: true },
        { type: "array" as const, items: { type: "object" as const, additionalProperties: true } },
      ],
    },
  },
};

export const apiErrorEnvelopeSchema = {
  type: "object" as const,
  required: ["success", "error"],
  properties: {
    success: { type: "boolean" as const, example: false },
    error: {
      type: "object" as const,
      additionalProperties: true,
      example: { message: "Resource not found" },
    },
  },
};

/** Documents `GET` list responses: `{ success: true, data: { items, total, page, pageSize, totalPages } }` */
export function ApiPaginatedListOk(summary?: string) {
  return applyDecorators(
    ApiPaginationQueries(),
    ApiExtraModels(PaginatedListDataDoc),
    ApiOkResponse({
      description: summary ?? "Paginated list",
      schema: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: getSchemaPath(PaginatedListDataDoc) },
        },
      },
    }),
  );
}

export function ApiEntityOk(description = "Resource wrapped in API envelope") {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: apiSuccessEnvelopeSchema,
    }),
    ApiNotFoundResponse({ description: "Resource not found", schema: apiErrorEnvelopeSchema }),
  );
}

export function ApiMutationOk(description = "Updated resource wrapped in API envelope") {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: apiSuccessEnvelopeSchema,
    }),
    ApiBadRequestResponse({ description: "Validation failed", schema: apiErrorEnvelopeSchema }),
    ApiNotFoundResponse({ description: "Resource not found", schema: apiErrorEnvelopeSchema }),
  );
}

export function ApiCreateOk(description = "Created resource wrapped in API envelope") {
  return applyDecorators(
    ApiCreatedResponse({
      description,
      schema: apiSuccessEnvelopeSchema,
    }),
    ApiBadRequestResponse({ description: "Validation failed", schema: apiErrorEnvelopeSchema }),
  );
}

export function ApiDeleteOk(description = "Deleted resource wrapped in API envelope") {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: apiSuccessEnvelopeSchema,
    }),
    ApiNotFoundResponse({ description: "Resource not found", schema: apiErrorEnvelopeSchema }),
  );
}
