import { ApiDeleteOk, ApiEntityOk, ApiMutationOk } from "@/common/http/swagger-response.decorators";
import { PermissionResource } from "@/auth/decorators/permission-resource.decorator";
import { parseZod } from "@/common/zod/zod.util";
import { ItemImagesService } from "@/items/item-images/item-images.service";
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const idSchema = z.string().min(1);
const activeSchema = z.object({ isActive: z.boolean() });

@ApiTags("item-master-images")
@PermissionResource("item-master-images")
@Controller("item-master/:sku/images")
export class ItemImagesController {
  constructor(private readonly service: ItemImagesService) {}

  @Get()
  @ApiOperation({ summary: "List images for an item master" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiEntityOk("Array of item images wrapped in API envelope")
  async list(@Param("sku") sku: string) {
    sku = parseZod(idSchema, sku);
    return this.service.listByItem(sku);
  }

  @Patch(":key")
  @ApiOperation({ summary: "Update item master image" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "IMG001" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        seq: { type: "integer", minimum: 0, example: 1 },
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
        itemMasterId: z.string().optional().nullable(),
      }),
      body,
    );
    return this.service.updateForItem(sku, key, values);
  }

  @Patch(":key/is-active")
  @ApiOperation({ summary: "Toggle item master image active state" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "IMG001" })
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
  @ApiOperation({ summary: "Delete item master image" })
  @ApiParam({ name: "sku", example: "SKU001" })
  @ApiParam({ name: "key", example: "IMG001" })
  @ApiDeleteOk()
  async remove(@Param("sku") sku: string, @Param("key") key: string) {
    sku = parseZod(idSchema, sku);
    key = parseZod(idSchema, key);
    return this.service.removeForItem(sku, key);
  }
}
