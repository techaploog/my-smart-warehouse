import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
};

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const key = await deriveKey(password, salt, SCRYPT_PARAMS);

  return [
    "scrypt",
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt,
    key.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, storedPassword: string) {
  const parts = storedPassword.split("$");

  if (parts[0] !== "scrypt" || parts.length !== 6) {
    return timingSafeStringEqual(password, storedPassword);
  }

  const [, n, r, p, salt, storedKey] = parts;
  const key = await deriveKey(password, salt, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  const stored = Buffer.from(storedKey, "base64url");

  return key.length === stored.length && timingSafeEqual(key, stored);
}

function timingSafeStringEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function deriveKey(password: string, salt: string, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}
