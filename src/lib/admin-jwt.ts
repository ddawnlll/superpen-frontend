import { DEFAULT_SUPERPEN_JWT_ISSUER } from "@/lib/admin-auth-shared";

type JwtPayload = {
  iss?: string;
  exp?: number;
  [key: string]: unknown;
};

function base64UrlToUint8Array(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function decodeJson<T>(value: string): T | null {
  try {
    const bytes = base64UrlToUint8Array(value);
    const text = new TextDecoder().decode(bytes);
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }

  return diff === 0;
}

async function verifyHs256Signature(unsignedToken: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const expectedSignature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(unsignedToken)),
  );

  return constantTimeEqual(expectedSignature, base64UrlToUint8Array(signature));
}

export async function verifyAdminJwt(token: string | undefined | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  const secret = process.env.SUPERPEN_JWT_SECRET;
  if (!secret) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = decodeJson<{ alg?: string; typ?: string }>(encodedHeader);
  const payload = decodeJson<JwtPayload>(encodedPayload);

  if (!header || !payload || header.alg !== "HS256") {
    return false;
  }

  const issuer = process.env.SUPERPEN_JWT_ISSUER || DEFAULT_SUPERPEN_JWT_ISSUER;
  if (payload.iss !== issuer) {
    return false;
  }

  if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  return verifyHs256Signature(`${encodedHeader}.${encodedPayload}`, encodedSignature, secret);
}
