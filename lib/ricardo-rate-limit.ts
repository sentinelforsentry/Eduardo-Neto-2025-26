import crypto from "node:crypto";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const MAX_BUCKETS = 500;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type GlobalRateLimitState = typeof globalThis & {
  __ricardoMagicLinkRateLimit?: Map<string, RateLimitBucket>;
};

function getStore() {
  const state = globalThis as GlobalRateLimitState;
  state.__ricardoMagicLinkRateLimit ??= new Map<string, RateLimitBucket>();
  return state.__ricardoMagicLinkRateLimit;
}

function createRateLimitKey(email: string, ip: string) {
  return crypto
    .createHash("sha256")
    .update(`${email.trim().toLowerCase()}:${ip}`)
    .digest("hex");
}

function pruneExpiredBuckets(store: Map<string, RateLimitBucket>, now: number) {
  if (store.size < MAX_BUCKETS) return;

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function isRicardoMagicLinkRateLimited(email: string, ip: string) {
  const now = Date.now();
  const store = getStore();
  const key = createRateLimitKey(email, ip);
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    pruneExpiredBuckets(store, now);
    return false;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  bucket.count += 1;
  return false;
}
