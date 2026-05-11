export type RicardoRedisConfig = {
  token: string;
  url: string;
};

export function getRicardoRedisConfig(): RicardoRedisConfig | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  return {
    token,
    url: url.replace(/\/+$/, ""),
  };
}

export async function ricardoRedisCommand<T>(config: RicardoRedisConfig, command: string[]) {
  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join("/")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ricardo Redis request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
}
