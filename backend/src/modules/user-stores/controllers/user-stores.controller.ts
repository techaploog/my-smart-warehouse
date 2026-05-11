import { ApiCreateOk, ApiDeleteOk, ApiEntityOk } from "@/common/http/swagger-response.decorators";
import type { RequestWithUser } from "@/modules/auth/auth.types";
import { PermissionResource } from "@/modules/auth/decorators/permission-resource.decorator";
import { StoreAccessGuard } from "@/modules/auth/guards/store-access.guard";
import { parseZod } from "@/common/zod/zod.util";
import { UserStoresService } from "@/modules/user-stores/services/user-stores.service";
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { z } from "zod";

const uuidParam = z.string().uuid();
const storeCodeParam = z.string().min(1).max(20);

@ApiTags("user-stores")
@PermissionResource("user-store")
@UseGuards(StoreAccessGuard)
@Controller("users")
export class UserStoresController {
  constructor(private readonly service: UserStoresService) {}

  @Get(":userId/stores")
  @ApiOperation({ summary: "List store codes assigned to a user" })
  @ApiParam({ name: "userId", format: "uuid" })
  @ApiEntityOk()
  async list(@Req() req: RequestWithUser, @Param("userId") userId: string) {
    userId = parseZod(uuidParam, userId);
    const caller = req.user!;
    return this.service.listStoresForUser(caller.id, caller.storeCodes, userId);
  }

  @Post(":userId/stores")
  @ApiOperation({
    summary: "Assign a user to a store",
    description:
      "Store-scoped callers may only assign users to stores they belong to. Global operators may assign to any existing store.",
  })
  @ApiParam({ name: "userId", format: "uuid" })
  @ApiBody({
    schema: {
      type: "object",
      required: ["storeCode"],
      properties: { storeCode: { type: "string", example: "ST01" } },
    },
  })
  @ApiCreateOk()
  async assign(@Req() req: RequestWithUser, @Param("userId") userId: string, @Body() body: unknown) {
    userId = parseZod(uuidParam, userId);
    const { storeCode } = parseZod(z.object({ storeCode: storeCodeParam }), body);
    return this.service.assignUserToStore(req.user!.storeCodes, userId, storeCode);
  }

  @Delete(":userId/stores/:storeCode")
  @ApiOperation({ summary: "Remove a user's assignment to a store" })
  @ApiParam({ name: "userId", format: "uuid" })
  @ApiParam({ name: "storeCode", example: "ST01" })
  @ApiDeleteOk()
  async remove(
    @Req() req: RequestWithUser,
    @Param("userId") userId: string,
    @Param("storeCode") storeCode: string,
  ) {
    userId = parseZod(uuidParam, userId);
    storeCode = parseZod(storeCodeParam, storeCode);
    return this.service.removeUserFromStore(req.user!.storeCodes, userId, storeCode);
  }
}
