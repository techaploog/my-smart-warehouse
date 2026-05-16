import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BranchGuard } from "./branch.guard";

@Injectable()
export class StoreAccessGuard extends BranchGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }
}
