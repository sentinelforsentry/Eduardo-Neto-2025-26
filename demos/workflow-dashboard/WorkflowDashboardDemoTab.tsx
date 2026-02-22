"use client";

import { WorkflowDashboardDemo } from "@/app/components/use-cases/workflow-dashboard/WorkflowDashboardDemo";

export default function WorkflowDashboardDemoTab() {
    return (
        <div className="space-y-8">
            <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 text-sm">
                <h3 className="mb-3 font-semibold text-white">How to test this demo</h3>
                <p className="mb-2 text-zinc-300">
                    The data grid shows a mock commercial banking task list. Try this sequence:
                </p>
                <ol className="list-decimal space-y-2 pl-6 text-zinc-300">
                    <li>Click any row to open the contextual edit form in a modal.</li>
                    <li>
                        Modify the <strong>Client Name</strong>, <strong>Amount</strong>, or <strong>Status</strong> fields.
                        <div className="mt-1 text-xs text-zinc-400">
                            Notice the data grid behind does <em>not</em> update — the form state is fully isolated.
                        </div>
                    </li>
                    <li>
                        Click <strong>&quot;Save Changes&quot;</strong> to trigger the mock API call. Watch the loading spinner and disabled button state during the 1.5s artificial delay.
                    </li>
                    <li>
                        After the mock response succeeds, the modal closes and the grid updates with your new values.
                    </li>
                    <li>
                        <strong>Error test:</strong> Open a row, tick the &quot;Simulate API Error&quot; checkbox, then save. The error is caught and displayed inside the modal without affecting the parent grid.
                    </li>
                    <li>
                        <strong>Cancel test:</strong> Edit a row, make changes, then click &quot;Cancel&quot;. All draft changes are discarded and the grid remains unmodified.
                    </li>
                </ol>
            </div>

            <WorkflowDashboardDemo />
        </div>
    );
}
