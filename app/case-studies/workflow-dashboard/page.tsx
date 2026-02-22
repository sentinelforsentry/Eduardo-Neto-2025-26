import Link from "next/link";

export const metadata = { title: "Internal Workflow Dashboard — Case Study" };

export default function WorkflowDashboardCaseStudy() {
    return (
        <article className="py-12">
            <h1 className="text-3xl font-bold text-white">Internal Workflow Dashboard</h1>
            <p className="mt-2 text-zinc-400">Client: Major Commercial Bank (Anonymized)</p>
            <div className="mt-6 grid gap-4 text-sm text-zinc-300 sm:grid-cols-3">
                <div><span className="text-zinc-400">Role:</span> Lead Front-End Engineer</div>
                <div><span className="text-zinc-400">Tech:</span> React, TypeScript, Compound Components</div>
                <div><span className="text-zinc-400">Outcome:</span> Robust state isolation &amp; reusable grid</div>
            </div>

            <section className="mt-10 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">1. The Challenge</h2>
                <p className="text-zinc-300">Internal workflow screens lacked clear separation between draft edits and committed state. Editing a record could inadvertently pollute the task list before the user confirmed changes, leading to data inconsistency and user confusion across the banking workflow.</p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">2. My Solution</h2>
                <p className="text-zinc-300">Designed a compound DataGrid component pattern with a contextual slide-over edit form. The form maintains strictly local draft state, completely decoupled from the shared task list. Changes only synchronize to the global state upon successful API submission, ensuring data integrity across all views.</p>
            </section>

            <section className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold text-[#ff8820]">3. The Outcome</h2>
                <p className="text-zinc-300">Eliminated accidental state leakage in the workflow UI; established a reusable compound component architecture adopted across multiple squads; measurably reduced bugs related to premature state synchronization.</p>
            </section>

            <div className="mt-10 flex flex-wrap gap-3">
                <Link
                    href="/demos/workflow-dashboard"
                    className="rounded-md bg-[#ff8820] px-4 py-2 text-sm font-medium text-black hover:brightness-110"
                >
                    See it in action — Workflow Dashboard
                </Link>
                <Link
                    href="/demos"
                    className="rounded-md border border-white/10 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
                >
                    All demos
                </Link>
            </div>
        </article>
    );
}
