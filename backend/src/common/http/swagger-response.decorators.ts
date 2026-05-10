import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from "@nestjs/swagger";
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
