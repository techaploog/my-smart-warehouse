import { ApiPaginatedListOk } from "@/common/http/swagger-response.decorators";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemCategoriesService } from "@/items/item-categories/item-categories.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { z } from "zod";

const idSchema = z.string().min(1);

@Controller("item-categories")
export class ItemCategoriesController {
  constructor(private readonly service: ItemCategoriesService) {}

  @Get()
  @ApiPaginatedListOk("List item categories (paginated)")
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
        name: z.string().min(1),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(z.object({ name: z.string().min(1).optional() }), body);
    return this.service.update(code, values);
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
