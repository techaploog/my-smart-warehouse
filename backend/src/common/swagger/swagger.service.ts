import { Injectable } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import {
  ApiErrorResponseDoc,
  ApiSuccessResponseDoc,
  PaginatedListDataDoc,
} from "../http/api-response.swagger";

@Injectable()
export class WarehouseSwaggerService {
  setup(app: NestFastifyApplication) {
    const config = new DocumentBuilder()
      .setTitle("My Smart Warehouse API")
      .setDescription("Backend API documentation for My Smart Warehouse.")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT from POST /api/v1/auth/login. Payload includes permissions and branchs.",
        },
        "bearer",
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ApiSuccessResponseDoc, ApiErrorResponseDoc, PaginatedListDataDoc],
    });

    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    return document;
  }
}
