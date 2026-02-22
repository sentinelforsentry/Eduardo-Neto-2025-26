import type { JSX } from "react";

const coverageLines = `√ WorkflowDashboardDemo (6)
  √ renders the initial data grid correctly
  √ opens the slide-over form when a row is clicked
  √ isolates state: changes in form do not immediately update the grid
  √ closes the form and discards changes on cancel
  √ shows loading state, simulates api delay, and optimistically updates grid on success
  √ shows error state and does not update parent grid on API failure

Test Files  1 passed (1)
     Tests  6 passed (6)
   Duration  ~0.8s`;

export default function WorkflowDashboardTestsTab(): JSX.Element {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-lg border border-white/10 bg-black p-6 text-sm text-zinc-300">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">What&apos;s covered</h3>
                        <ul className="list-disc space-y-2 pl-5 text-zinc-200">
                            <li>State isolation: typing in the form does NOT update the underlying data grid until a successful save.</li>
                            <li>Cancel discards local draft changes completely — the parent grid is verified unchanged.</li>
                            <li>Loading state: the save button is disabled and shows a spinner during the mock API delay.</li>
                            <li>Optimistic update: after a successful mock API response, the grid reflects the new values and the slide-over closes.</li>
                            <li>Error handling: a simulated API failure displays the error in the form without modifying the parent grid.</li>
                        </ul>
                        <p className="text-xs text-zinc-400">
                            Tests live in <code className="rounded bg-white/10 px-1">app/components/use-cases/workflow-dashboard/__tests__/WorkflowDashboardDemo.test.tsx</code>,
                            using Vitest + React Testing Library with jsdom and fake timers to exercise the full component lifecycle.
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
