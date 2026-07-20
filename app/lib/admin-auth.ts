import { createHash, timingSafeEqual } from "node:crypto";
import { redis } from "@/app/lib/redis";

export const ADMIN_PASSWORD_HEADER = "x-admin-password";
const FALLBACK_PASSWORD_DIGEST = Buffer.from("87cac0cf5c796b4231bae592e1258e185b9aee6de96ec57ec56b24104236b045", "hex");
const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_SECONDS = 15 * 60;

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * Validates the admin password without shipping it in the client bundle or
 * exposing it in URLs. Hashing both values first gives timingSafeEqual two
 * fixed-length buffers, even when the supplied password has a different length.
 */
export async function isAdminRequestAuthorized(request: Request): Promise<boolean> {
  const suppliedPassword = request.headers.get(ADMIN_PASSWORD_HEADER);
  if (!suppliedPassword) return false;
  const expectedDigest = process.env.CARESTAY_ADMIN_PASSWORD
    ? digest(process.env.CARESTAY_ADMIN_PASSWORD)
    : FALLBACK_PASSWORD_DIGEST;
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const attemptKey = `carestay:admin-attempts:${createHash("sha256").update(forwardedFor).digest("hex").slice(0, 24)}`;

  try {
    const failures = Number(await redis.get<number>(attemptKey) || 0);
    if (failures >= MAX_FAILED_ATTEMPTS) return false;
  } catch { /* Continue with password verification if rate-limit storage is unavailable. */ }

  const credentialValid = timingSafeEqual(expectedDigest, digest(suppliedPassword));
  if (credentialValid) return true;

  try {
    const nextFailures = await redis.incr(attemptKey);
    if (nextFailures === 1) await redis.expire(attemptKey, LOCKOUT_SECONDS);
  } catch { /* A storage outage must not turn a bad credential into a valid one. */ }

  return false;
}
