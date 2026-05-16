import { Injectable, Scope } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";

type LogContext = Record<string, unknown> & {
  requestId?: string;
  userId?: string;
};

type BusinessEventContext = LogContext & {
  event: string;
};

type ExternalCallContext = LogContext & {
  provider: string;
  method: string;
  endpoint: string;
  durationMs: number;
  retryCount?: number;
};

type ErrorLogContext = LogContext & {
  err: unknown;
};

@Injectable({ scope: Scope.TRANSIENT })
export class WarehouseLoggerService {
  constructor(private readonly logger: PinoLogger) {}

  setContext(module: string) {
    this.logger.setContext(module);
  }

  info(context: LogContext, message: string) {
    this.logger.info(this.withRequestId(context), message);
  }

  warn(context: LogContext, message: string) {
    this.logger.warn(this.withRequestId(context), message);
  }

  businessEvent(context: BusinessEventContext, message: string) {
    this.logger.info(this.withRequestId(context), message);
  }

  externalCall(context: ExternalCallContext, message = "External API call completed") {
    const level = context.durationMs >= 5000 ? "warn" : "info";
    this.logger[level](this.withRequestId(context), message);
  }

  error(context: ErrorLogContext, message: string) {
    this.logger.error(
      {
        ...this.withRequestId(context),
        err: this.normalizeError(context.err),
      },
      message,
    );
  }

  private withRequestId<T extends LogContext>(context: T): T & { requestId: string } {
    return {
      ...context,
      requestId: context.requestId ?? "system",
    };
  }

  private normalizeError(err: unknown) {
    if (err instanceof Error) {
      return {
        type: err.name,
        message: err.message,
        stack: err.stack,
      };
    }

    return {
      type: typeof err,
      value: err,
    };
  }
}
