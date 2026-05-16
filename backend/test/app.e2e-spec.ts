import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter({ logger: false }),
    );
    await app.init();
  });

  it("/ (GET)", async () => {
    const fastify = app.getHttpAdapter().getInstance();
    const res = await fastify.inject({ method: "GET", url: "/" });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toEqual({
      success: true,
      data: {
        value: "NestJS - Hello World!",
      },
    });
  });

  it("/missing (GET)", async () => {
    const fastify = app.getHttpAdapter().getInstance();
    const res = await fastify.inject({ method: "GET", url: "/missing" });

    expect(res.statusCode).toBe(404);
    const body = JSON.parse(res.payload) as {
      success: boolean;
      error: { message?: string; error?: string };
    };
    expect(body.success).toBe(false);
    expect(body.error.message).toEqual(expect.stringMatching(/GET|Not Found|Cannot/));
  });

  afterEach(async () => {
    await app.close();
  });
});
