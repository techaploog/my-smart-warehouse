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
import { ItemUnitsService } from "@/items/item-units/item-units.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-units")
@PermissionResource("item-units")
@Controller("item-units")
export class ItemUnitsController {
  constructor(private readonly service: ItemUnitsService) {}

  @Get()
  @ApiOperation({ summary: "List item units (paginated)" })
  @ApiPaginatedListOk("List item units (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  @ApiOperation({ summary: "Get item unit by code" })
  @ApiParam({ name: "code", example: "pcs" })
  @ApiEntityOk()
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
  @ApiOperation({ summary: "Create item unit" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 20, example: "pcs" },
        details: { type: "string", nullable: true, example: "Pieces" },
      },
    },
  })
  @ApiCreateOk()
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        code: z.string().min(1).max(20),
        details: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  @ApiOperation({ summary: "Update item unit" })
  @ApiParam({ name: "code", example: "pcs" })
  @ApiMutationOk()
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(
      z.object({
        details: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.update(code, values);
  }

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle item unit active state" })
  @ApiParam({ name: "code", example: "pcs" })
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
  @ApiOperation({ summary: "Delete item unit" })
  @ApiParam({ name: "code", example: "pcs" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
