import crypto from "node:crypto";
import { MAGIC_LINK_MAX_AGE_SECONDS } from "@/lib/ricardo-auth";
import { getRicardoRedisConfig, ricardoRedisCommand } from "@/lib/ricardo-redis";

type RedisSetResponse = {
  result?: "OK" | null;
};

declare global {
  var ricardoMagicLinkStore: Map<string, number> | undefined;
}

function hash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function createConsumedTokenKey(jti: string) {
  return `ricardo:magic-link:used:${hash(jti)}`;
}

function consumeDevelopmentMagicLinkJti(jti: string) {
  const now = Date.now();
  const expiresAt = now + MAGIC_LINK_MAX_AGE_SECONDS * 1000;
  const store = globalThis.ricardoMagicLinkStore ?? new Map<string, number>();
  globalThis.ricardoMagicLinkStore = store;

  for (const [tokenId, tokenExpiresAt] of store) {
    if (tokenExpiresAt <= now) {
      store.delete(tokenId);
    }
  }

  if (store.has(jti)) {
    return false;
  }

  store.set(jti, expiresAt);

  return true;
}

export async function consumeRicardoMagicLinkJti(jti: string) {
  const config = getRicardoRedisConfig();

  if (!config) {
    return process.env.NODE_ENV === "production" ? false : consumeDevelopmentMagicLinkJti(jti);
  }

  try {
    const { result } = await ricardoRedisCommand<RedisSetResponse>(config, [
      "set",
      createConsumedTokenKey(jti),
      "1",
      "nx",
      "ex",
      String(MAGIC_LINK_MAX_AGE_SECONDS),
    ]);

    return result === "OK";
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }

    return false;
  }
}
