import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { createLoggerParams } from "./logger.config";
import { WarehouseLoggerService } from "./warehouse-logger.service";

@Global()
@Module({
  imports: [LoggerModule.forRoot(createLoggerParams())],
  providers: [WarehouseLoggerService],
  exports: [LoggerModule, WarehouseLoggerService],
})
export class AppLoggerModule {}
