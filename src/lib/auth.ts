import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { findTokenByValue } from "./kv";
import type { AgentToken } from "./types";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getJwtSecret());
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function getSessionFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

/**
 * Verify an agent API token from an Authorization header.
 * Checks KV-stored tokens first; falls back to PUBLISH_API_KEY env var for
 * backward-compatibility (returns a synthetic record with name "Agent").
 * Returns the matching AgentToken on success, or null on failure.
 */
export async function verifyAgentToken(
  authHeader: string | null
): Promise<AgentToken | null> {
  if (!authHeader) return null;
  const [scheme, rawToken] = authHeader.split(" ");
  if (scheme !== "Bearer" || !rawToken) return null;

  // Check KV-stored tokens
  try {
    const found = await findTokenByValue(rawToken);
    if (found) return found;
  } catch {
    // KV not configured — fall through to env fallback
  }

  // Backward-compat: single env-var key
  const envKey = process.env.PUBLISH_API_KEY;
  if (envKey && rawToken === envKey) {
    return { id: "env", name: "Agent", token: envKey, createdAt: new Date(0).toISOString() };
  }

  return null;
}

export function verifyAdminCredentials(
  username: string,
  password: string
): boolean {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export { SESSION_COOKIE };
