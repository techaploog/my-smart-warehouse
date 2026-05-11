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
import { StoreMastersService } from "@/modules/stock/services/store-masters.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("store-masters")
@PermissionResource("store-masters")
@Controller("store-masters")
export class StoreMastersController {
  constructor(private readonly service: StoreMastersService) {}

  @Get()
  @ApiOperation({ summary: "List store masters (paginated)" })
  @ApiPaginatedListOk("List store masters (paginated)")
  async list(@Query() query: unknown) {
    const pagination = parsePaginationQuery(query);
    return this.service.list(pagination);
  }

  @Get(":code")
  @ApiOperation({ summary: "Get store master by code" })
  @ApiParam({ name: "code", example: "ST01" })
  @ApiEntityOk()
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.get(code);
  }

  @Post()
  @ApiOperation({ summary: "Create store master" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["code", "name"],
      properties: {
        code: { type: "string", minLength: 1, maxLength: 20, example: "ST01" },
        name: { type: "string", minLength: 1, example: "Main Warehouse" },
        address: { type: "string", nullable: true },
        phone: { type: "string", nullable: true },
        email: { type: "string", nullable: true },
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
        remarks: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.create(values);
  }

  @Patch(":code")
  @ApiOperation({ summary: "Update store master" })
  @ApiParam({ name: "code", example: "ST01" })
  @ApiMutationOk()
  async update(@Param("code") code: string, @Body() body: unknown) {
    code = parseZod(idSchema, code);
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
        address: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        email: z.string().optional().nullable(),
        remarks: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
      }),
      body,
    );
    return this.service.update(code, values);
  }

  @Patch(":code/is-active")
  @ApiOperation({ summary: "Toggle store master active state" })
  @ApiParam({ name: "code", example: "ST01" })
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
  @ApiOperation({ summary: "Delete store master" })
  @ApiParam({ name: "code", example: "ST01" })
  @ApiDeleteOk()
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
