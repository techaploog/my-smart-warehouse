import {
  ApiCreateOk,
  ApiDeleteOk,
  ApiEntityOk,
  ApiMutationOk,
  ApiPaginatedListOk,
} from "@/common/http/swagger-response.decorators";
import { PermissionResource } from "@/modules/auth/decorators/permission-resource.decorator";
import { StoreAccessGuard } from "@/modules/auth/guards/store-access.guard";
import type { RequestWithUser } from "@/modules/auth/auth.types";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { decodeItemSkuPathSegment } from "@warehouse/shared";
import { ItemStocksService, type StoreScope } from "@/modules/stock/services/item-stocks.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const stockListQuerySchema = z.object({
  code: z.string().min(1).optional(),
  storeCode: z.string().min(1).optional(),
  itemSku: z.string().optional(),
});
const activeSchema = z.object({ isActive: z.boolean() });

function scopeFromRequest(req: RequestWithUser): StoreScope {
  const codes = req.allowedStoreCodes ?? req.user?.storeCodes;
  if (codes?.length) return codes;
  return null;
}

@ApiTags("stock")
@PermissionResource("stock")
@UseGuards(StoreAccessGuard)
@Controller("stock")
export class ItemStocksController {
  constructor(private readonly service: ItemStocksService) {}

  @Get()
  @ApiOperation({ summary: "List stock records by code, store code, or item SKU (paginated)" })
  @ApiQuery({ name: "code", required: false, example: "SHELF-A1" })
  @ApiQuery({ name: "storeCode", required: false, example: "ST01" })
  @ApiQuery({ name: "itemSku", required: false, example: "SKU001" })
  @ApiPaginatedListOk("List stock records (paginated)")
  async list(@Req() req: RequestWithUser, @Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    const filters = parseZod(stockListQuerySchema, query);
    return this.service.list({ ...pagination, ...filters }, scopeFromRequest(req));
  }

  @Get(":storeCode/:code/:itemSkuSegment")
  @ApiOperation({
    summary: "Get stock record by store, shelf code, and item SKU segment",
    description:
      "Use path segment `_` when the stock row has no item SKU (null). Otherwise pass the SKU (URL-encoded if needed).",
  })
  @ApiParam({ name: "storeCode", example: "ST01" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiParam({ name: "itemSkuSegment", example: "SKU001", description: "Or `_` for no SKU" })
  @ApiEntityOk()
  async get(
    @Req() req: RequestWithUser,
    @Param("storeCode") storeCode: string,
    @Param("code") code: string,
    @Param("itemSkuSegment") itemSkuSegment: string,
  ) {
    storeCode = parseZod(idSchema, storeCode);
    code = parseZod(idSchema, code);
    itemSkuSegment = parseZod(idSchema, itemSkuSegment);
    const itemSku = decodeItemSkuPathSegment(itemSkuSegment);
    return this.service.get(code, storeCode, itemSku, scopeFromRequest(req));
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
  async create(@Req() req: RequestWithUser, @Body() body: unknown) {
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
    return this.service.create(values, scopeFromRequest(req));
  }

  @Patch(":storeCode/:code/:itemSkuSegment")
  @ApiOperation({ summary: "Update stock record" })
  @ApiParam({ name: "storeCode", example: "ST01" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiParam({ name: "itemSkuSegment", example: "SKU001", description: "Or `_` for no SKU" })
  @ApiMutationOk()
  async update(
    @Req() req: RequestWithUser,
    @Param("storeCode") storeCode: string,
    @Param("code") code: string,
    @Param("itemSkuSegment") itemSkuSegment: string,
    @Body() body: unknown,
  ) {
    storeCode = parseZod(idSchema, storeCode);
    code = parseZod(idSchema, code);
    itemSkuSegment = parseZod(idSchema, itemSkuSegment);
    const itemSku = decodeItemSkuPathSegment(itemSkuSegment);
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
    return this.service.update(code, storeCode, itemSku, values, scopeFromRequest(req));
  }

  @Patch(":storeCode/:code/:itemSkuSegment/is-active")
  @ApiOperation({ summary: "Toggle stock active state" })
  @ApiParam({ name: "storeCode", example: "ST01" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiParam({ name: "itemSkuSegment", example: "SKU001", description: "Or `_` for no SKU" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["isActive"],
      properties: { isActive: { type: "boolean", example: false } },
    },
  })
  @ApiMutationOk()
  async toggleActive(
    @Req() req: RequestWithUser,
    @Param("storeCode") storeCode: string,
    @Param("code") code: string,
    @Param("itemSkuSegment") itemSkuSegment: string,
    @Body() body: unknown,
  ) {
    storeCode = parseZod(idSchema, storeCode);
    code = parseZod(idSchema, code);
    itemSkuSegment = parseZod(idSchema, itemSkuSegment);
    const itemSku = decodeItemSkuPathSegment(itemSkuSegment);
    const values = parseZod(activeSchema, body);
    return this.service.update(code, storeCode, itemSku, values, scopeFromRequest(req));
  }

  @Delete(":storeCode/:code/:itemSkuSegment")
  @ApiOperation({ summary: "Delete stock record" })
  @ApiParam({ name: "storeCode", example: "ST01" })
  @ApiParam({ name: "code", example: "SHELF-A1" })
  @ApiParam({ name: "itemSkuSegment", example: "SKU001", description: "Or `_` for no SKU" })
  @ApiDeleteOk()
  async remove(
    @Req() req: RequestWithUser,
    @Param("storeCode") storeCode: string,
    @Param("code") code: string,
    @Param("itemSkuSegment") itemSkuSegment: string,
  ) {
    storeCode = parseZod(idSchema, storeCode);
    code = parseZod(idSchema, code);
    itemSkuSegment = parseZod(idSchema, itemSkuSegment);
    const itemSku = decodeItemSkuPathSegment(itemSkuSegment);
    return this.service.remove(code, storeCode, itemSku, scopeFromRequest(req));
  }
}
