import type { JSX } from "react";

const coverageLines = `✓ useBookingFilter (6)
  ✓ initializes with default values
  ✓ updates valid dates successfully
  ✓ rejects invalid date ranges
  ✓ enforces min guest limits
  ✓ enforces max guest limits
  ✓ calculates price estimate correctly

✓ BookingWidget (4)
  ✓ renders initial trigger button
  ✓ opens modal on click
  ✓ allows keyboard navigation and properly closes
  ✓ updates guests and calculates price

Test Files  2 passed (2)
     Tests  10 passed (10)
   Duration  ~1.0s`;

export default function BookingTestsOverview(): JSX.Element {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-white/10 bg-black p-6 text-sm text-zinc-300">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">What&apos;s covered</h3>
                        <ul className="list-disc space-y-2 pl-5 text-zinc-200">
                            <li>Guest limits (min/max) cannot be exceeded via the counter controls.</li>
                            <li>Invalid date ranges (check-out before check-in) are silently rejected.</li>
                            <li>Price estimate reacts correctly to date range × guest count changes.</li>
                            <li>ARIA roles are present: <code className="rounded bg-white/10 px-1">role=&quot;dialog&quot;</code>, <code className="rounded bg-white/10 px-1">aria-modal</code>, <code className="rounded bg-white/10 px-1">aria-expanded</code>.</li>
                            <li>Modal is keyboard navigable and closes on Save.</li>
                        </ul>
                        <p className="text-xs text-zinc-400">
                            Tests live in <code className="rounded bg-white/10 px-1">app/components/use-cases/booking-widget/__tests__/</code>,
                            using Vitest + React Testing Library with jsdom.
                        </p>
                    </div>
                </section>
                <section className="rounded-lg border border-white/10 bg-black p-6 text-sm text-zinc-300">
                    <p className="mb-3 font-medium text-white">Run locally</p>
                    <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/60 p-3 text-xs text-[#ff8820]">
                        <code>npm run test</code>
                    </pre>
                    <p className="mt-4 text-xs text-zinc-400">Sample output:</p>
                    <pre className="overflow-x-auto rounded-md border border-white/10 bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-300">
                        <code>{coverageLines}</code>
                    </pre>
                </section>
            </div>
        </div>
    );
}
