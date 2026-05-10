import { ApiPaginatedListOk } from "@/common/http/swagger-response.decorators";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemBrandsService } from "@/items/item-brands/item-brands.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);

const successEnvelope = {
  type: "object" as const,
  required: ["success", "data"],
  properties: {
    success: { type: "boolean" as const, example: true },
    data: { type: "object" as const, additionalProperties: true },
  },
};

const errorEnvelope = {
  type: "object" as const,
  required: ["success", "error"],
  properties: {
    success: { type: "boolean" as const, example: false },
    error: {
      type: "object" as const,
      additionalProperties: true,
      example: { message: "Item brand not found" },
    },
  },
};

@ApiTags("item-brands")
@Controller("item-brands")
export class ItemBrandsController {
  constructor(private readonly service: ItemBrandsService) {}

  @Get()
  @ApiOperation({ summary: "List item brands (paginated)" })
  @ApiPaginatedListOk("Paginated item brands")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  @ApiOperation({ summary: "Get item brand by code" })
  @ApiParam({ name: "code", example: "BR-01", description: "Brand code (primary key)" })
  @ApiOkResponse({
    description: "Single item brand wrapped in API envelope",
    schema: successEnvelope,
  })
  @ApiNotFoundResponse({ description: "Unknown code", schema: errorEnvelope })
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    const row = await this.service.get(code);
    return row;
  }

  @Post()
  @ApiOperation({ summary: "Create item brand" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code", "name"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 20, example: "BR-01" },
        name: { type: "string", minLength: 1, example: "Acme" },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Created row in `data` (global interceptor wraps body)",
    schema: successEnvelope,
  })
  @ApiBadRequestResponse({
    description: "Validation failed (e.g. Zod issues)",
    schema: errorEnvelope,
  })
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        code: z.string().min(1).max(20),
        name: z.string().min(1),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  @ApiOperation({ summary: "Update item brand" })
  @ApiParam({ name: "code", example: "BR-01" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1, example: "Acme Logistics" },
      },
    },
  })
  @ApiOkResponse({
    description: "Updated row in `data`",
    schema: successEnvelope,
  })
  @ApiBadRequestResponse({ description: "Validation failed", schema: errorEnvelope })
  @ApiNotFoundResponse({ description: "Unknown code", schema: errorEnvelope })
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
      }),
      body,
    );
    const row = await this.service.update(code, values);
    return row;
  }

  @Delete(":code")
  @ApiOperation({ summary: "Delete item brand" })
  @ApiParam({ name: "code", example: "BR-01" })
  @ApiOkResponse({
    description: "Deleted row in `data`",
    schema: successEnvelope,
  })
  @ApiNotFoundResponse({ description: "Unknown code", schema: errorEnvelope })
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
