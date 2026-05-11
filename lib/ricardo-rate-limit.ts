import crypto from "node:crypto";

const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const INCREMENT_WITH_TTL_SCRIPT = `
  local current = redis.call("INCR", KEYS[1])
  if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
  end
  return current
`;

const rateLimits = [
  { scope: "email-ip", max: 3 },
  { scope: "email", max: 10 },
] as const;

type RedisConfig = {
  token: string;
  url: string;
};

type RedisNumberResponse = {
  result?: number;
};

function getRedisConfig(): RedisConfig | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return {
    token,
    url: url.replace(/\/+$/, ""),
  };
}

function getClientIp(req: Request) {
  // Vercel overwrites x-forwarded-for, so this avoids trusting client-supplied proxy headers.
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function createRateLimitKey(scope: (typeof rateLimits)[number]["scope"], email: string, req: Request) {
  const normalizedEmail = email.trim().toLowerCase();
  const clientIp = getClientIp(req);
  const value = scope === "email-ip" ? `${normalizedEmail}:${clientIp}` : normalizedEmail;

  return `ricardo:magic-link:${scope}:${hash(value)}`;
}

async function redisCommand<T>(config: RedisConfig, command: string[]) {
  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Rate limit store request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

async function incrementBucket(config: RedisConfig, key: string) {
  const { result } = await redisCommand<RedisNumberResponse>(config, [
    "eval",
    INCREMENT_WITH_TTL_SCRIPT,
    "1",
    key,
    String(RATE_LIMIT_WINDOW_SECONDS),
  ]);

  if (typeof result !== "number") {
    throw new Error("Rate limit store returned an invalid counter.");
  }

  return result;
}

export async function isRicardoMagicLinkRateLimited(email: string, req: Request) {
  const config = getRedisConfig();

  if (!config) {
    return process.env.NODE_ENV === "production";
  }

  try {
    for (const limit of rateLimits) {
      const count = await incrementBucket(config, createRateLimitKey(limit.scope, email, req));

      if (count > limit.max) {
        return true;
      }
    }

    return false;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }

    return true;
  }
}
