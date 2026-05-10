import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { z } from "zod";
import { parseZod } from "../../common/zod/zod.util";
import { ItemMastersService } from "./item-masters.service";

const idSchema = z.string().min(1);
const moneySchema = z.coerce
  .number()
  .nonnegative()
  .transform((n) => n.toFixed(2));

@Controller("item-masters")
export class ItemMastersController {
  constructor(private readonly service: ItemMastersService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Get(":sku")
  async get(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.get(sku);
  }

  @Post()
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

  @Delete(":sku")
  async remove(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.remove(sku);
  }
}
