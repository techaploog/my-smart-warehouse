import { createHmac, timingSafeEqual } from "node:crypto";

type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

const JWT_ALGORITHM = "HS256";
const DEFAULT_TTL_SECONDS = 60 * 60 * 24;

export function signJwt(
  payload: Pick<JwtPayload, "sub" | "email">,
  secret: string,
  ttlSeconds = DEFAULT_TTL_SECONDS,
) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: JWT_ALGORITHM, typ: "JWT" };
  const body: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const encodedHeader = encodeJson(header);
  const encodedBody = encodeJson(body);
  const signature = sign(`${encodedHeader}.${encodedBody}`, secret);

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function verifyJwt(token: string, secret: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");

  const [encodedHeader, encodedBody, signature] = parts;
  const expectedSignature = sign(`${encodedHeader}.${encodedBody}`, secret);

  if (!timingSafeBase64UrlEqual(signature, expectedSignature)) {
    throw new Error("Invalid token signature");
  }

  const header = decodeJson<{ alg: string }>(encodedHeader);
  if (header.alg !== JWT_ALGORITHM) throw new Error("Unsupported token algorithm");

  const payload = decodeJson<JwtPayload>(encodedBody);
  const now = Math.floor(Date.now() / 1000);
  if (!payload.sub || !payload.email || payload.exp <= now) throw new Error("Token expired");

  return payload;
}

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decodeJson<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeBase64UrlEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}
