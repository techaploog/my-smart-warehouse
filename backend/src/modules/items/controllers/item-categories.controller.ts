import {
  ApiCreateOk,
  ApiDeleteOk,
  ApiEntityOk,
  ApiMutationOk,
  ApiPaginatedListOk,
} from "@/common/http/swagger-response.decorators";
import { PermissionResource } from "@/modules/auth/decorators/permission-resource.decorator";
import { parsePaginationQuery } from "@/common/pagination/pagination.schema";
import { parseZod } from "@/common/zod/zod.util";
import { ItemCategoriesService } from "@/modules/items/services/item-categories.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-categories")
@PermissionResource("item-categories")
@Controller("item-categories")
export class ItemCategoriesController {
  constructor(private readonly service: ItemCategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List item categories (paginated)" })
  @ApiPaginatedListOk("List item categories (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  @ApiOperation({ summary: "Get item category by code" })
  @ApiParam({ name: "code", example: "CAT01" })
  @ApiEntityOk()
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
  @ApiOperation({ summary: "Create item category" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code", "name"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 20, example: "CAT01" },
        name: { type: "string", minLength: 1, example: "Raw materials" },
      },
    },
  })
  @ApiCreateOk()
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
  @ApiOperation({ summary: "Update item category" })
  @ApiParam({ name: "code", example: "CAT01" })
  @ApiBody({
    schema: {
      type: "object",
      properties: { name: { type: "string", minLength: 1, example: "Finished goods" } },
    },
  })
  @ApiMutationOk()
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(z.object({ name: z.string().min(1).optional() }), body);
    return this.service.update(code, values);
  }

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle item category active state" })
  @ApiParam({ name: "code", example: "CAT01" })
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
  @ApiOperation({ summary: "Delete item category" })
  @ApiParam({ name: "code", example: "CAT01" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
