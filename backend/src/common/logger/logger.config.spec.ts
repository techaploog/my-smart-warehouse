import { createLoggerParams } from "./logger.config";
import type { TransportSingleOptions } from "pino";
import type { Options as PinoHttpOptions } from "pino-http";

describe("createLoggerParams", () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.LOG_LEVEL;
    delete process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("uses pretty transport in development by default", () => {
    process.env.NODE_ENV = "development";
    const params = createLoggerParams();
    const pinoHttp = params.pinoHttp as PinoHttpOptions;

    const transport = pinoHttp.transport;
    expect(transport).toBeDefined();
    expect((transport as TransportSingleOptions).target).toBe("pino-pretty");
  });

  it("does not use transport in production", () => {
    process.env.NODE_ENV = "production";
    const params = createLoggerParams();
    const pinoHttp = params.pinoHttp as PinoHttpOptions;

    expect(pinoHttp.transport).toBeUndefined();
  });

  it("uses useExisting when NODE_ENV is test (no pino-http middleware)", () => {
    delete process.env.E2E_TEST;
    process.env.NODE_ENV = "test";
    const params = createLoggerParams();

    expect(params.useExisting).toBe(true);
    expect(params.pinoHttp).toBeUndefined();
  });

  it("uses useExisting when E2E_TEST is true", () => {
    process.env.NODE_ENV = "development";
    process.env.E2E_TEST = "true";
    const params = createLoggerParams();

    expect(params.useExisting).toBe(true);
    delete process.env.E2E_TEST;
  });

  it("respects LOG_LEVEL override", () => {
    process.env.NODE_ENV = "production";
    process.env.LOG_LEVEL = "debug";
    const params = createLoggerParams();
    const pinoHttp = params.pinoHttp as PinoHttpOptions;

    expect(pinoHttp.level).toBe("debug");
  });

  it("includes redaction rules for sensitive fields", () => {
    process.env.NODE_ENV = "development";
    const params = createLoggerParams();
    const pinoHttp = params.pinoHttp as PinoHttpOptions;
    const redact = pinoHttp.redact;

    expect((redact as { paths: string[] } | undefined)?.paths).toEqual(
      expect.arrayContaining([
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.refreshToken",
      ]),
    );
  });

  it("uses msg as message key and maps context to module", () => {
    process.env.NODE_ENV = "development";
    const params = createLoggerParams();
    const pinoHttp = params.pinoHttp as PinoHttpOptions;

    expect(params.renameContext).toBe("module");
    expect(pinoHttp.messageKey).toBe("msg");
  });
});
