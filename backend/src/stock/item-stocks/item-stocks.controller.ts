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
import { ItemStocksService } from "@/stock/item-stocks/item-stocks.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const stockListQuerySchema = z.object({
  code: z.string().min(1).optional(),
  storeCode: z.string().min(1).optional(),
  itemSku: z.string().min(1).optional(),
});
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("stock")
@PermissionResource("stock")
@Controller("stock")
export class ItemStocksController {
  constructor(private readonly service: ItemStocksService) {}

  @Get()
  @ApiOperation({ summary: "List stock records by code, store code, or item SKU (paginated)" })
  @ApiQuery({ name: "code", required: false, example: "SHELF-A1" })
  @ApiQuery({ name: "storeCode", required: false, example: "ST01" })
  @ApiQuery({ name: "itemSku", required: false, example: "SKU001" })
  @ApiPaginatedListOk("List stock records (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    const filters = parseZod(stockListQuerySchema, query);
    return this.service.list({ ...pagination, ...filters });
  }

  @Get(":code")
  @ApiOperation({ summary: "Get stock record by stock code" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiEntityOk()
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
  @ApiOperation({ summary: "Create stock record" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code", "name"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 50, example: "SHELF-A1" },
        name: { type: "string", minLength: 1, example: "Shelf A1" },
        description: { type: "string", nullable: true },
        itemSku: { type: "string", nullable: true, example: "SKU001" },
        storeCode: { type: "string", nullable: true, example: "ST01" },
        qty: { type: "integer", minimum: 0 },
        maxQty: { type: "integer", minimum: 0 },
        minQty: { type: "integer", minimum: 0 },
        reorderPoint: { type: "integer", minimum: 0 },
        safetyStock: { type: "integer", minimum: 0 },
        remarks: { type: "string", nullable: true },
      },
    },
  })
  @ApiCreateOk()
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        code: z.string().min(1).max(50),
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        itemSku: z.string().optional().nullable(),
        storeCode: z.string().optional().nullable(),
        qty: z.coerce.number().int().nonnegative().optional(),
        maxQty: z.coerce.number().int().nonnegative().optional(),
        minQty: z.coerce.number().int().nonnegative().optional(),
        reorderPoint: z.coerce.number().int().nonnegative().optional(),
        safetyStock: z.coerce.number().int().nonnegative().optional(),
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  @ApiOperation({ summary: "Update stock record" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiMutationOk()
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        itemSku: z.string().optional().nullable(),
        storeCode: z.string().optional().nullable(),
        qty: z.coerce.number().int().nonnegative().optional(),
        maxQty: z.coerce.number().int().nonnegative().optional(),
        minQty: z.coerce.number().int().nonnegative().optional(),
        reorderPoint: z.coerce.number().int().nonnegative().optional(),
        safetyStock: z.coerce.number().int().nonnegative().optional(),
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.update(code, values);
  }

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle stock active state" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
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
  @ApiOperation({ summary: "Delete stock record" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
