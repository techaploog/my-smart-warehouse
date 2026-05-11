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
import { ItemMastersService } from "@/items/item-masters/item-masters.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const moneySchema = z.coerce
  .number()
  .nonnegative()
  .transform((n) => n.toFixed(2));
const activeSchema = z.object({ isActive: z.boolean() });
const effectiveSchema = z.object({
  effectiveFrom: z.coerce.date().optional().nullable(),
  effectiveTo: z.coerce.date().optional().nullable(),
});

@ApiTags("item-master")
@PermissionResource("item-master")
@Controller("item-master")
export class ItemMastersController {
  constructor(private readonly service: ItemMastersService) {}

  @Get()
  @ApiOperation({ summary: "List item masters (paginated)" })
  @ApiPaginatedListOk("List item masters (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":sku")
  @ApiOperation({ summary: "Get item master by SKU" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiEntityOk()
  async get(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.get(sku);
  }

  @Post()
  @ApiOperation({ summary: "Create item master" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["sku", "name"],
      properties: {
        sku: { type: "string", minLength: 1, maxLength: 100, example: "SKU001" },
        name: { type: "string", minLength: 1, example: "Widget" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string", nullable: true },
        brandId: { type: "string", nullable: true },
        model: { type: "string", nullable: true },
        specification: { type: "string", nullable: true },
        unit: { type: "string", nullable: true, example: "pcs" },
        unitPrice: { type: "number", minimum: 0, example: 10.5 },
        supplierId: { type: "string", nullable: true },
        buildOutAt: { type: "string", format: "date-time", nullable: true },
        effectiveFrom: { type: "string", format: "date-time", nullable: true },
        effectiveTo: { type: "string", format: "date-time", nullable: true },
        orderLeadTime: { type: "integer", minimum: 0 },
        remarks: { type: "string", nullable: true },
      },
    },
  })
  @ApiCreateOk()
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        sku: z.string().min(1).max(100),
        name: z.string().min(1),
        description: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
        brandId: z.string().optional().nullable(),
        model: z.string().optional().nullable(),
        specification: z.string().optional().nullable(),
        unit: z.string().optional().nullable(),
        unitPrice: moneySchema.optional(),
        supplierId: z.string().optional().nullable(),
        buildOutAt: z.coerce.date().optional().nullable(),
        effectiveFrom: z.coerce.date().optional().nullable(),
        effectiveTo: z.coerce.date().optional().nullable(),
        orderLeadTime: z.coerce.number().int().nonnegative().optional(),
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":sku")
  @ApiOperation({ summary: "Update item master" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiMutationOk()
  async update(@Param("sku") sku: string, @Body() body: unknown) {
    sku = parseZod(idSchema, sku);
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        categoryId: z.string().optional().nullable(),
        brandId: z.string().optional().nullable(),
        model: z.string().optional().nullable(),
        specification: z.string().optional().nullable(),
        unit: z.string().optional().nullable(),
        unitPrice: moneySchema.optional(),
        supplierId: z.string().optional().nullable(),
        buildOutAt: z.coerce.date().optional().nullable(),
        effectiveFrom: z.coerce.date().optional().nullable(),
        effectiveTo: z.coerce.date().optional().nullable(),
        orderLeadTime: z.coerce.number().int().nonnegative().optional(),
        remarks: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
      }),
      body,
    );
    return this.service.update(sku, values);
  }

  @Patch(":sku/effective")
  @ApiOperation({ summary: "Update item master effective period" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        effectiveFrom: { type: "string", format: "date-time", nullable: true },
        effectiveTo: { type: "string", format: "date-time", nullable: true },
      },
    },
  })
  @ApiMutationOk()
  async updateEffective(@Param("sku") sku: string, @Body() body: unknown) {
    sku = parseZod(idSchema, sku);
    const values = parseZod(effectiveSchema, body);
    return this.service.update(sku, values);
  }

  @Patch(":sku/is-active")
  @ApiOperation({ summary: "Toggle item master active state" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["isActive"],
      properties: { isActive: { type: "boolean", example: false } },
    },
  })
  @ApiMutationOk()
  async toggleActive(@Param("sku") sku: string, @Body() body: unknown) {
    sku = parseZod(idSchema, sku);
    const values = parseZod(activeSchema, body);
    return this.service.update(sku, values);
  }

  @Delete(":sku")
  @ApiOperation({ summary: "Delete item master" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiDeleteOk()
  async remove(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.remove(sku);
  }
}
