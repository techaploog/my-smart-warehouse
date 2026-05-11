import {
  ApiCreateOk,
  ApiDeleteOk,
  ApiEntityOk,
  ApiMutationOk,
  ApiPaginatedListOk,
} from "@/common/http/swagger-response.decorators";
import { PermissionResource } from "@/auth/decorators/permission-resource.decorator";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemBrandsService } from "@/items/item-brands/item-brands.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-brands")
@PermissionResource("item-brands")
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
  @ApiEntityOk("Single item brand wrapped in API envelope")
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
  @ApiCreateOk()
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
  @ApiMutationOk()
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

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle item brand active state" })
  @ApiParam({ name: "code", example: "BR-01" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["isActive"],
      properties: { isActive: { type: "boolean", example: false } },
    },
  })
  @ApiMutationOk()
  async toggleActive(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(activeSchema, body);
    return this.service.update(code, values);
  }

  @Delete(":code")
  @ApiOperation({ summary: "Delete item brand" })
  @ApiParam({ name: "code", example: "BR-01" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
