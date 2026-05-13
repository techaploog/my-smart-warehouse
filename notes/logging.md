# Logging Notes

Use structured JSON logging with Pino.

The goal is not just to print messages. Good logs should support:

- request tracing
- business audit trails
- external dependency monitoring
- incident reconstruction

For this project, `requestId` is one of the most important fields. If a request enters the system, its logs should be easy to follow across controllers, services, database calls, and external integrations.

## Recommended Log Levels

- `10` trace: extremely detailed diagnostic data, usually only for temporary troubleshooting
- `20` debug: developer-focused debugging information that is useful locally but usually too noisy for normal production logs
- `30` info: normal successful flow
- `40` warn: slow call, retry, partial failure, suspicious condition
- `50` error: failed operation or unhandled exception
- `60` fatal: unrecoverable failure that will terminate the process or leave the service unable to continue safely

## 1. HTTP Request Log

This log is usually emitted automatically by HTTP middleware or a Pino HTTP logger.

It is the baseline operational log for every incoming request.

### Example

```json
{
  "level": 30,
  "time": "2026-05-11T10:00:00.000Z",
  "service": "warehouse-api",
  "requestId": "req_123",
  "method": "POST",
  "path": "/api/v1/inventory-documents",
  "statusCode": 201,
  "durationMs": 145,
  "ip": "10.0.1.15",
  "msg": "HTTP request completed"
}
```

### Required Fields

- `method`
- `path`
- `statusCode`
- `durationMs`
- `requestId`

### Notes

- This log should exist for almost every request.
- Keep field names stable so dashboards and searches stay reliable.
- Avoid putting large request bodies or sensitive data in automatic request logs.

## 2. Business Event Log

This is not debug logging.

This log exists for:

- business telemetry
- audit trail
- incident reconstruction

Use it when an important domain action happens, for example:

- inventory document created
- transfer approved
- transfer received
- stock adjusted
- cycle count completed

### Example

```json
{
  "level": 30,
  "time": "2026-05-11T10:00:00.000Z",
  "service": "warehouse-api",
  "requestId": "req_123",
  "userId": "u_99",
  "documentId": "doc_88",
  "documentType": "stock_transfer",
  "fromStoreCode": "ST01",
  "toStoreCode": "ST02",
  "msg": "Inventory transfer approved"
}
```

### Notes

- Include the business identifiers needed to understand the event later.
- Prefer stable keys like `documentId`, `itemSku`, `storeCode`, or `transferId`.
- The message should describe what happened in business terms, not implementation terms.

## 3. External API Call Log

This is very important whenever the backend calls another service, provider, or third-party API.

These logs should make slow or failing dependencies immediately searchable.

### Example

```json
{
  "level": 40,
  "time": "2026-05-11T10:00:00.000Z",
  "service": "warehouse-api",
  "requestId": "req_123",
  "provider": "scb",
  "method": "POST",
  "endpoint": "/v1/transfer",
  "durationMs": 5200,
  "retryCount": 2,
  "msg": "Slow provider API"
}
```

### Recommended Fields

- `requestId`
- `provider`
- `method`
- `endpoint`
- `durationMs`
- `retryCount`

### Notes

- Log retries and slow responses even if the request eventually succeeds.
- Use consistent provider names so alerts and searches are easy to build.
- Do not log secrets, tokens, or full credential payloads.

## 4. Error Log

This is the highest-value log during an incident.

A good error log should answer:

- what failed
- which request it belonged to
- which business object was affected
- which dependency or operation failed

### Example

```json
{
  "level": 50,
  "time": "2026-05-11T10:00:00.000Z",
  "service": "warehouse-api",
  "requestId": "req_123",
  "userId": "u_99",
  "documentId": "doc_88",
  "documentType": "stock_transfer",
  "provider": "scb",
  "durationMs": 10000,
  "err": {
    "type": "TimeoutError",
    "message": "SCB API timeout",
    "stack": "..."
  },
  "msg": "Transfer failed"
}
```

## Golden Rules

- Always include `requestId`.
- Always include the error object as `err`.
- Always include business context such as `userId`, `documentId`, `itemSku`, or `storeCode` when available.
- Use stable field names across the entire system.
- Write messages for operators, not just developers.
- Never log secrets, passwords, tokens, or sensitive personal data.

## Practical Standard For This Project

When adding logs in this codebase, prefer these four categories:

1. HTTP request log
2. Business event log
3. External API call log
4. Error log

If a log line does not help with tracing, auditability, or production operations, it is probably debug noise and should be reconsidered.
