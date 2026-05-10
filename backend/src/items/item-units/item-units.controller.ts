import { ApiPaginatedListOk } from "@/common/http/swagger-response.decorators";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemUnitsService } from "@/items/item-units/item-units.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { z } from "zod";
const idSchema = z.string().min(1);

@Controller("item-units")
export class ItemUnitsController {
  constructor(private readonly service: ItemUnitsService) {}

  @Get()
  @ApiPaginatedListOk("List item units (paginated)")
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
        code: z.string().min(1).max(20),
        details: z.string().optional().nullable(),
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
        details: z.string().optional().nullable(),
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
