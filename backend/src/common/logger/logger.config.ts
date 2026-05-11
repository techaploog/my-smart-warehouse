import type { Params } from "nestjs-pino";
import type { IncomingMessage, ServerResponse } from "node:http";

type NodeEnv = "development" | "test" | "production";

type RequestIdHeader = string | string[] | undefined;

type PinoReqLike = IncomingMessage & {
  id?: string | number;
  method?: string;
  url?: string;
  routerPath?: string;
  remoteAddress?: string;
  remotePort?: number;
  headers: Record<string, RequestIdHeader>;
};

type PinoResLike = ServerResponse & {
  statusCode?: number;
};

const DEFAULT_SERVICE_NAME = "backend";

function nodeEnv(): NodeEnv {
  const env = (process.env.NODE_ENV ?? "development") as NodeEnv;
  if (env === "production" || env === "test") return env;
  return "development";
}

function normalizePath(url: string | undefined): string {
  if (!url) return "/";
  const path = url.split("?")[0];
  return path.length > 0 ? path : "/";
}

function resolveModule(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "root";
  if (segments[0] === "api" && segments[1] === "v1") {
    return segments[2] ?? "root";
  }
  return segments[0];
}

export function createLoggerParams(): Params {
  const env = nodeEnv();
  const isProduction = env === "production";
  const service = process.env.SERVICE_NAME ?? DEFAULT_SERVICE_NAME;
  const transport =
    env === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            singleLine: true,
            ignore: "pid,hostname",
          },
        }
      : undefined;

  const level =
    process.env.LOG_LEVEL ?? (isProduction ? "info" : env === "test" ? "silent" : "debug");

  // Skip registering pino-http middleware in Jest (see test/jest-e2e-setup.ts). `pinoHttp: false`
  // is treated as `{}` by nestjs-pino and still installs a broken middleware.
  if (env === "test" || process.env.E2E_TEST === "true") {
    return {
      renameContext: "module",
      useExisting: true,
    };
  }

  return {
    renameContext: "module",
    pinoHttp: {
      level,
      messageKey: "msg",
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
      formatters: {
        bindings() {
          return {
            service,
            env,
          };
        },
      },
      genReqId(req: PinoReqLike, res: PinoResLike) {
        const header = req.headers["x-request-id"];
        const requestId: string =
          typeof header === "string" && header.trim().length > 0
            ? header.trim()
            : (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);

        res.setHeader("x-request-id", requestId);
        return requestId;
      },
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.headers.set-cookie",
          "req.body.password",
          "req.body.currentPassword",
          "req.body.newPassword",
          "req.body.confirmPassword",
          "req.body.token",
          "req.body.refreshToken",
          "req.body.accessToken",
        ],
        censor: "[Redacted]",
      },
      customSuccessObject(req: PinoReqLike, res: PinoResLike, responseTime: number) {
        const path = normalizePath(req.url);
        return {
          service,
          env,
          requestId: String(req.id ?? "unknown"),
          module: resolveModule(path),
          method: req.method,
          path,
          statusCode: res.statusCode,
          durationMs: Math.round(responseTime),
          ip: req.remoteAddress,
        };
      },
      customErrorObject(req: PinoReqLike, res: PinoResLike, err: Error, responseTime: number) {
        const path = normalizePath(req.url);
        return {
          service,
          env,
          requestId: String(req.id ?? "unknown"),
          module: resolveModule(path),
          method: req.method,
          path,
          statusCode: res.statusCode,
          durationMs: Math.round(responseTime),
          ip: req.remoteAddress,
          err: {
            type: err.name,
            message: err.message,
            stack: err.stack,
          },
        };
      },
      customSuccessMessage() {
        return "HTTP request completed";
      },
      customErrorMessage() {
        return "HTTP request failed";
      },
      transport,
      quietReqLogger: true,
      quietResLogger: true,
      autoLogging: {
        ignore(req) {
          const url = req.url ?? "";
          return url.startsWith("/api/docs") || url.startsWith("/api/docs/");
        },
      },
    },
  };
}
