import { ApiProperty } from "@nestjs/swagger";
import { type ApiResponseData, type JsonObject } from "@warehouse/shared";

export class ApiSuccessResponseDoc {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({
    oneOf: [
      { type: "object", additionalProperties: true },
      { type: "array", items: { type: "object", additionalProperties: true } },
    ],
    example: { value: "NestJS - Hello World!" },
  })
  data!: ApiResponseData;
}

export class ApiErrorResponseDoc {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({
    type: "object",
    additionalProperties: true,
    example: { message: "Cannot GET /missing", error: "Not Found" },
  })
  error!: JsonObject;
}

/** Shape of `data` for paginated collection endpoints */
export class PaginatedListDataDoc {
  @ApiProperty({
    type: "array",
    items: { type: "object", additionalProperties: true },
    description: "Rows for the current page",
  })
  items!: unknown[];

  @ApiProperty({ example: 42, description: "Total rows matching the query (all pages)" })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  pageSize!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}
