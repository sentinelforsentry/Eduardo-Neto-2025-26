"use client";

import NaiveDemo from "./NaiveDemo";
import RtkDemo from "./RtkDemo";

export default function RtkComparison() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-white/10 bg-black p-6 md:grid-cols-2">
        <div className="space-y-3">
          <span className="text-sm uppercase tracking-widest text-zinc-400">Baseline</span>
          <h2 className="text-xl font-semibold text-white">Naive Fetch &amp; Local State</h2>
          <p className="text-sm text-zinc-300">
            Two components each call `fetch` inside `useEffect`, so every change
            triggers redundant network requests. Caching is manual, error paths
            are fragile, and both lists manage their state independently.
          </p>
        </div>
        <div className="space-y-3">
          <span className="text-sm uppercase tracking-widest text-[#ff8820]">Improved</span>
          <h2 className="text-xl font-semibold text-white">RTK Query Caching &amp; Mutations</h2>
          <p className="text-sm text-zinc-300">
            A single RTK Query slice dedupes requests, keeps data warm, and
            invalidates on mutation. Metrics show fewer HTTP calls while the UI
            stays consistent across components that share the cache.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 text-sm">
        <h3 className="mb-3 font-semibold text-white">How to test this demo</h3>
        <p className="mb-2 text-zinc-300">
          Each panel owns its own network meter with a cache-hit counter. Try this sequence:
        </p>
        <ol className="list-decimal space-y-2 pl-6 text-zinc-300">
          <li>Press <strong>“Reset metrics”</strong> on both sides.</li>
          <li>
            Type <code className="rounded bg-black/50 px-1.5 py-0.5 text-zinc-200">alpha</code>, then <code className="rounded bg-black/50 px-1.5 py-0.5 text-zinc-200">beta</code>, then <code className="rounded bg-black/50 px-1.5 py-0.5 text-zinc-200">alpha</code> again in each filter.
            <div className="mt-1 text-xs text-zinc-400">
              (Try searching for: <span className="text-zinc-300">alpha, beta, gamma, delta, epsilon</span>)
            </div>
          </li>
          <li>
            Watch how the naive totals climb twice as fast (two fetches per component) while the RTK version
            only issues a single request per filter and serves the second list from cache.
          </li>
          <li>
            <strong>Mutation test:</strong> Click the &quot;Mutate first item&quot; button in the RTK panel. Watch how the preview updates instantly and the network makes exactly one invalidation refresh. If you interact or type again, notice how cache hits increment as the newly-warmed data is reused without extra network calls.
          </li>
        </ol>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-white/10 bg-black p-4 shadow-lg shadow-black/40">
          <h3 className="text-lg font-semibold text-white">Naive implementation</h3>
          <NaiveDemo />
        </div>
        <div className="space-y-4 rounded-lg border border-[#ff8820]/40 bg-black p-4 shadow-lg shadow-black/40">
          <h3 className="text-lg font-semibold text-[#ff8820]">RTK Query implementation</h3>
          <RtkDemo />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-zinc-900 p-6 text-sm text-zinc-300">
        <h3 className="mb-3 text-lg font-semibold text-white">What is happening in both lists for each panel?</h3>
        <p className="mb-4">
          In modern React applications, it is very common for multiple disjoint components on the same screen to require the exact same piece of data (for example, a user&apos;s profile picture might be needed in both the top navigation bar and a sidebar).
        </p>
        <p className="mb-4">
          The two lists simulate this real-world scenario where two different components ask for the exact same data at the exact same time:
        </p>
        <ul className="mb-4 list-disc space-y-2 pl-5 text-zinc-400">
          <li>
            <strong className="text-zinc-200">In the Naive Implementation:</strong> Each list independently calls <code className="rounded bg-black/50 px-1.5 py-0.5 text-zinc-200">useEffect</code> to fetch data. Because there are two components, typing triggers <strong>two entirely redundant network requests</strong> simultaneously. The browser does twice the work necessary.
          </li>
          <li>
            <strong className="text-zinc-200">In the RTK Query Implementation:</strong> Both components ask for the data at the exact same time, but RTK Query acts as a middleman. It realizes both components are asking for identical data, deduplicates the requests, hits the network exactly <strong>once</strong>, and then shares the single resulting payload with both components.
          </li>
        </ul>
        <p>
          Having two lists visibly proves that RTK Query solves the &quot;N+1&quot; redundant fetch problem out-of-the-box, saving significant bandwidth and computing power!
        </p>
      </div>
    </div>
  );
}


