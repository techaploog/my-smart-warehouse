import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
  ApiErrorResponseDoc,
  ApiSuccessResponseDoc,
  PaginatedListDataDoc,
} from "./common/http/api-response.swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix("api/v1");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("My Smart Warehouse API")
    .setDescription("Backend API documentation for My Smart Warehouse.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ApiSuccessResponseDoc, ApiErrorResponseDoc, PaginatedListDataDoc],
  });
  SwaggerModule.setup("api/docs", app, swaggerDocument);

  const port = Number(process.env.PORT ?? 3300);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger docs are available at http://localhost:${port}/api/docs`);
}

void bootstrap();
