import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { z } from "zod";
import { parseZod } from "../../common/zod/zod.util";
import { ItemBrandsService } from "./item-brands.service";

const idSchema = z.string().min(1);

@Controller("item-brands")
export class ItemBrandsController {
  constructor(private readonly service: ItemBrandsService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Get(":code")
  async get(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    const row = await this.service.get(code);
    return row;
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
    const values = parseZod(
      z.object({
        name: z.string().min(1).optional(),
      }),
      body,
    );
    const row = await this.service.update(code, values);
    return row;
  }

  @Delete(":code")
  async remove(@Param("code") code: string) {
    code = parseZod(idSchema, code);
    return this.service.remove(code);
  }
}
