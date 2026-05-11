import { Global, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { createLoggerParams } from "./logger.config";

@Global()
@Module({
  imports: [LoggerModule.forRoot(createLoggerParams())],
  exports: [LoggerModule],
})
export class AppLoggerModule {}

