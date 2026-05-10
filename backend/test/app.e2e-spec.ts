import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect({
        success: true,
        code: "SUCCESS",
        data: {
          value: "NestJS - Hello World!",
        },
      });
  });

  it("/missing (GET)", () => {
    return request(app.getHttpServer())
      .get("/missing")
      .expect(404)
      .expect({
        success: false,
        code: "NOT_FOUND",
        data: {
          message: "Cannot GET /missing",
          error: "Not Found",
        },
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
