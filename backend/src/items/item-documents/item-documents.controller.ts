import { ApiPaginatedListOk } from "@/common/http/swagger-response.decorators";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemDocumentsService } from "@/items/item-documents/item-documents.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { z } from "zod";

const idSchema = z.string().min(1);

@Controller("item-documents")
export class ItemDocumentsController {
  constructor(private readonly service: ItemDocumentsService) {}

  @Get()
  @ApiPaginatedListOk("List item documents (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":key")
  async get(@Param("key") key: string) {
    key = parseZod(idSchema, key);
    return this.service.get(key);
  }

  @Post()
  async create(@Body() body: unknown) {
    const values = parseZod(
      z.object({
        key: z.string().min(1).max(100),
        seq: z.coerce.number().int().nonnegative().optional(),
        title: z.string().min(1),
        description: z.string().optional().nullable(),
        type: z.string().min(1).max(20).optional(),
        itemMasterId: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":key")
  async update(@Param("key") key: string, @Body() body: unknown) {
    key = parseZod(idSchema, key);
    const values = parseZod(
      z.object({
        seq: z.coerce.number().int().nonnegative().optional(),
        title: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        type: z.string().min(1).max(20).optional(),
        itemMasterId: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
      }),
      body,
    );
    return this.service.update(key, values);
  }

  @Delete(":key")
  async remove(@Param("key") key: string) {
    key = parseZod(idSchema, key);
    return this.service.remove(key);
  }
}
