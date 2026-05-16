import { ApiCreateOk, ApiDeleteOk, ApiEntityOk } from "@/common/http/swagger-response.decorators";
import { zodPipe } from "@/common/zod/zod.util";
import type { RequestWithUser } from "@/modules/auth/auth.types";
import { PermissionResource } from "@/modules/auth/decorators/permission-resource.decorator";
import { BranchGuard } from "@/modules/auth/guards/branch.guard";
import { parseZod } from "@/common/zod/zod.util";
import { UserStoresService } from "@/modules/user-stores/services/user-stores.service";
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { assignUserToStoreSchema, type AssignUserToStoreDto } from "@warehouse/shared";
import { z } from "zod";

const uuidParam = z.string().uuid();
const storeCodeParam = z.string().min(1).max(20);

@ApiTags("user-stores")
@PermissionResource("user-store")
@UseGuards(BranchGuard)
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
    return this.service.listStoresForUser(caller.id, caller.branchs, userId);
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
  async assign(
    @Req() req: RequestWithUser,
    @Param("userId") userId: string,
    @Body(zodPipe(assignUserToStoreSchema)) body: AssignUserToStoreDto,
  ) {
    userId = parseZod(uuidParam, userId);
    return this.service.assignUserToStore(req.user!.branchs, userId, body.storeCode);
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
    return this.service.removeUserFromStore(req.user!.branchs, userId, storeCode);
  }
}
