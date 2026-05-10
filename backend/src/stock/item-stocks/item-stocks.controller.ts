import { ApiPaginatedListOk } from "@/common/http/swagger-response.decorators";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemStocksService } from "@/stock/item-stocks/item-stocks.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { z } from "zod";

const idSchema = z.string().min(1);

@Controller("item-stocks")
export class ItemStocksController {
  constructor(private readonly service: ItemStocksService) {}

  @Get()
  @ApiPaginatedListOk("List item stocks (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
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
        isActive: z.boolean().optional(),
      }),
      body,
    );
    return this.service.update(code, values);
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
