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
import { ItemSuppliersService } from "@/items/item-suppliers/item-suppliers.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-suppliers")
@PermissionResource("item-suppliers")
@Controller("item-suppliers")
export class ItemSuppliersController {
  constructor(private readonly service: ItemSuppliersService) {}

  @Get()
  @ApiOperation({ summary: "List item suppliers (paginated)" })
  @ApiPaginatedListOk("List item suppliers (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  @ApiOperation({ summary: "Get item supplier by code" })
  @ApiParam({ name: "code", example: "SUP01" })
  @ApiEntityOk()
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
  @ApiOperation({ summary: "Create item supplier" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code", "name"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 20, example: "SUP01" },
        name: { type: "string", minLength: 1, example: "Acme Supply" },
        address: { type: "string", nullable: true },
        phone: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
        website: { type: "string", nullable: true },
        remarks: { type: "string", nullable: true },
      },
    },
  })
  @ApiCreateOk()
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        code: z.string().min(1).max(20),
        name: z.string().min(1),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        website: z.string().optional().nullable(),
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  @ApiOperation({ summary: "Update item supplier" })
  @ApiParam({ name: "code", example: "SUP01" })
  @ApiMutationOk()
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        website: z.string().optional().nullable(),
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.update(code, values);
  }

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle item supplier active state" })
  @ApiParam({ name: "code", example: "SUP01" })
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
  @ApiOperation({ summary: "Delete item supplier" })
  @ApiParam({ name: "code", example: "SUP01" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
