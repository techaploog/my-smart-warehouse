import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { z } from "zod";
import { parseZod } from "../../common/zod/zod.util";
import { ItemImagesService } from "./item-images.service";

const idSchema = z.string().min(1);

@Controller("item-images")
export class ItemImagesController {
  constructor(private readonly service: ItemImagesService) {}

  @Get()
  async list() {
    return this.service.list();
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
