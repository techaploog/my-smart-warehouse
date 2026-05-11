import { ApiDeleteOk, ApiEntityOk, ApiMutationOk } from "@/common/http/swagger-response.decorators";
import { PermissionResource } from "@/modules/auth/decorators/permission-resource.decorator";
import { parseZod } from "@/common/zod/zod.util";
import { ItemDocumentsService } from "@/modules/items/services/item-documents.service";
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-master-docs")
@PermissionResource("item-master-docs")
@Controller("item-master/:sku/docs")
export class ItemDocumentsController {
  constructor(private readonly service: ItemDocumentsService) {}

  @Get()
  @ApiOperation({ summary: "List documents for an item master" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiEntityOk("Array of item documents wrapped in API envelope")
  async list(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.listByItem(sku);
  }

  @Patch(":key")
  @ApiOperation({ summary: "Update item master document" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "DOC001" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        seq: { type: "integer", minimum: 0, example: 1 },
        title: { type: "string", minLength: 1, example: "Specification" },
        description: { type: "string", nullable: true },
        type: { type: "string", maxLength: 20, example: "pdf" },
        itemMasterId: { type: "string", nullable: true, example: "SKU001" },
      },
    },
  })
  @ApiMutationOk()
  async update(@Param("sku") sku: string, @Param("key") key: string, @Body() body: unknown) {
    sku = parseZod(idSchema, sku);
    key = parseZod(idSchema, key);
    const values = parseZod(
      z.object({
        seq: z.coerce.number().int().nonnegative().optional(),
        title: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        type: z.string().min(1).max(20).optional(),
        itemMasterId: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.updateForItem(sku, key, values);
  }

  @Patch(":key/is-active")
  @ApiOperation({ summary: "Toggle item master document active state" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "DOC001" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["isActive"],
      properties: { isActive: { type: "boolean", example: false } },
    },
  })
  @ApiMutationOk()
  async toggleActive(@Param("sku") sku: string, @Param("key") key: string, @Body() body: unknown) {
    sku = parseZod(idSchema, sku);
    key = parseZod(idSchema, key);
    const values = parseZod(activeSchema, body);
    return this.service.updateForItem(sku, key, values);
  }

  @Delete(":key")
  @ApiOperation({ summary: "Delete item master document" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "DOC001" })
  @ApiDeleteOk()
  async remove(@Param("sku") sku: string, @Param("key") key: string) {
    sku = parseZod(idSchema, sku);
    key = parseZod(idSchema, key);
    return this.service.removeForItem(sku, key);
  }
}
