import Link from "next/link";
import { WorkflowDashboardDemo } from "@/app/components/use-cases/workflow-dashboard/WorkflowDashboardDemo";

export const metadata = { title: "Internal Workflow Dashboard — Case Study" };

export default function WorkflowDashboardCaseStudy() {
    return (
        <article className="py-12">
            <div className="mb-4">
                <Link
                    href="/case-studies"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    &larr; Back to Case Studies
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-white">
                Internal Workflow Dashboard
            </h1>
            <p className="mt-2 text-zinc-400">
                Client: Major Commercial Bank (Anonymized)
            </p>

            <div className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-4">
                <div>
                    <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">
                        Role
                    </span>
                    Lead Front-End Engineer
                </div>
                <div>
                    <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">
                        Tech Stack
                    </span>
                    React, TypeScript, Next.js
                </div>
                <div>
                    <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">
                        Core Focus
                    </span>
                    State Management & Architecture
                </div>
                <div>
                    <span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">
                        Outcome
                    </span>
                    Robust UI, Data Isolation
                </div>
            </div>

            <section className="mt-12 space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white">
                        Live Interactive Demo
                    </h2>
                    <p className="mt-2 text-zinc-400">
                        A sanitized implementation demonstrating the core architectural
                        decisions of the commercial banking workflow list. Click any row to
                        edit its details in a fully isolated slide-over context.
                    </p>
                </div>

                <div className="mt-8 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-8">
                    <WorkflowDashboardDemo />
                </div>
            </section>

            <section className="mt-16 space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold text-[#ff8820]">
                        Feature Overview & Architecture
                    </h2>
                    <p className="mt-3 text-zinc-300 leading-relaxed">
                        In complex enterprise applications, the separation between "shared global state" and "local draft state" is critical. If a user begins editing a row in a data grid, those modifications should not immediately pollute the underlying data model or other parts of the application until they are intentionally saved.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white">
                        1. State Isolation Strategy
                    </h3>
                    <p className="text-zinc-400">
                        The edit form inside the slide-over maintains a local draft of the
                        task. This prevents the parent grid from re-rendering with uncommitted data. Upon
                        successful submission, the local state transitions to a "saving"
                        status, makes the API call, and eventually signals the parent to
                        incorporate the new truth.
                    </p>
                    <div className="rounded-lg bg-zinc-900/80 p-4 border border-white/10 overflow-x-auto text-sm">
                        <pre className="text-zinc-300 font-mono">
                            {`function EditTaskForm({ task, onSaveSuccess }) {
  // Local draft state, completely detached from the global task list
  const [draft, setDraft] = useState(task);
  const [isSaving, setIsSaving] = useState(false);

  // Syncs draft if the parent's data unexpectedly changes across network
  useEffect(() => setDraft(task), [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Fake API delay
      const updatedTask = await apiMock(draft); 
      // Synchronize back to global state only after success
      onSaveSuccess(updatedTask);
    } catch (err) { ... }
  };
}`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white">
                        2. Compound Component Pattern
                    </h3>
                    <p className="text-zinc-400">
                        To make the layout highly reusable and maintainable, the data grid
                        uses a compound component pattern (e.g., <code>&lt;DataGrid.Row&gt;</code>). This exposes discrete sub-components to the developer, increasing
                        flexibility while enforcing a consistent visual language.
                    </p>
                    <div className="rounded-lg bg-zinc-900/80 p-4 border border-white/10 overflow-x-auto text-sm">
                        <pre className="text-zinc-300 font-mono">
                            {`<DataGrid>
  <DataGrid.Header>
    <DataGrid.Cell isHeader>Client Name</DataGrid.Cell>
    {/* ... */}
  </DataGrid.Header>
  <DataGrid.Body>
    {tasks.map(task => (
      <DataGrid.Row key={task.id} onClick={() => openEdit(task)}>
        <DataGrid.Cell>{task.clientName}</DataGrid.Cell>
        {/* ... */}
      </DataGrid.Row>
    ))}
  </DataGrid.Body>
</DataGrid>`}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-medium text-white">
                        3. Mock API & Error Handling
                    </h3>
                    <p className="text-zinc-400">
                        The demo deliberately introduces network latency and error flows to realistically represent what occurs during data mutations. If an error is caught, the UI reverts the saving state and presents the issue within the isolated context, preserving the global state integrity.
                    </p>
                    <div className="rounded-lg bg-zinc-900/80 p-4 border border-white/10 overflow-x-auto text-sm">
                        <pre className="text-zinc-300 font-mono">
                            {`const updateTaskInDatabase = (task, shouldFail) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Network Error"));
      else resolve(task);
    }, 1500);
  });
};`}
                        </pre>
                    </div>
                </div>
            </section>
        </article>
    );
}
