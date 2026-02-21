"use client";

import { useEffect, useState } from "react";
import RenderCountBadge from "@/app/components/demos/RenderCountBadge";

type Item = {
  id: string;
  name: string;
  category: string;
  updatedAt: number;
};

type Props = {
  filter: string;
  fetcher: typeof fetch;
};

export default function NaiveList({ filter, fetcher }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher(`/api/demos/items?filter=${encodeURIComponent(filter)}&delay=400&error=0`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: Item[] };
        if (!cancelled) setItems(data.items);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [filter, fetcher]);

  const loadedCount = items?.length ?? 0;

  return (
    <div className="rounded-lg border border-white/10 bg-black p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Naive list</h3>
        <RenderCountBadge />
      </div>
      <div className="mb-3 text-sm text-zinc-300">
        {loading ? "Fetching…" : `Loaded ${loadedCount} items`}
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      {items && items.length > 0 && (
        <div className="mt-2 rounded-md bg-white/5 px-3 py-2 text-sm">
          <p className="text-zinc-300">
            Total items: <span className="font-semibold text-white">{items.length}</span>
          </p>
          <div className="mt-2 text-xs">
            <span className="text-zinc-500">First item preview:</span>
            <div className="mt-1 flex items-center gap-2 rounded border border-white/10 bg-black/50 px-2 py-1">
              <span className="text-white">{items[0].name}</span>
              <span className="text-zinc-400">({items[0].category})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
