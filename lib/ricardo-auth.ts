import crypto from "node:crypto";
import { cookies } from "next/headers";

export const RICARDO_AUTH_COOKIE = "ricardo_scigliano_session";

export const MAGIC_LINK_MAX_AGE_SECONDS = 15 * 60;
export const SESSION_MAX_AGE_SECONDS = 14 * 24 * 60 * 60;

type AuthPayload = {
  email: string;
  exp: number;
  jti?: string;
  purpose: "magic" | "session";
};

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function getSecret() {
  const secret = process.env.RICARDO_MAGIC_LINK_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("RICARDO_MAGIC_LINK_SECRET must be configured with at least 32 characters.");
  }

  return secret;
}

function sign(payload: string) {
  return base64UrlEncode(
    crypto.createHmac("sha256", getSecret()).update(payload).digest(),
  );
}

function createToken(email: string, purpose: AuthPayload["purpose"], maxAgeSeconds: number) {
  const payloadObject = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
    ...(purpose === "magic" ? { jti: crypto.randomUUID() } : {}),
    purpose,
  } satisfies AuthPayload;

  const payload = base64UrlEncode(
    JSON.stringify(payloadObject),
  );

  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined, expectedPurpose: AuthPayload["purpose"]) {
  if (!token) return null;

  const [payload, signature] = token.split(".");

  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as AuthPayload;

    if (parsed.purpose !== expectedPurpose) return null;
    if (!parsed.email || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (expectedPurpose === "magic" && typeof parsed.jti !== "string") return null;

    return parsed;
  } catch {
    return null;
  }
}

export function createMagicLinkToken(email: string) {
  return createToken(email, "magic", MAGIC_LINK_MAX_AGE_SECONDS);
}

export function verifyMagicLinkToken(token: string | undefined) {
  return verifyToken(token, "magic");
}

export function createSessionToken(email: string) {
  return createToken(email, "session", SESSION_MAX_AGE_SECONDS);
}

export async function getRicardoSession() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(RICARDO_AUTH_COOKIE)?.value, "session");
}

export function isAllowedRicardoEmail(email: string) {
  const allowList = process.env.RICARDO_ALLOWED_EMAILS;

  if (!allowList) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const allowed = allowList
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(normalizedEmail);
}
