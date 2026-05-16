import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import "dotenv/config";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { WarehouseLoggerService } from "./common/logger/warehouse-logger.service";
import { WarehouseSwaggerService } from "./common/swagger/swagger.service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  app.setGlobalPrefix("api/v1");

  app.get(WarehouseSwaggerService).setup(app);

  const port = Number(process.env.PORT ?? 3300);
  await app.listen({ port, host: "0.0.0.0" });

  const logger = await app.resolve(WarehouseLoggerService);
  logger.setContext("bootstrap");
  logger.info({ requestId: "system", module: "bootstrap", port }, "Server started");
  logger.info(
    { requestId: "system", module: "bootstrap", docsPath: "/api/docs" },
    "Swagger docs available",
  );
}

void bootstrap();
