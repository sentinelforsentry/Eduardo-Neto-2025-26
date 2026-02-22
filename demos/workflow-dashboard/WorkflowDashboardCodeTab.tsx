import Link from "next/link";
import CodePane from "@/app/components/demos/CodePane";

const stateIsolationCode = [
    `function EditTaskForm({ task, onCancel, onSaveSuccess }) {`,
    `  // Local draft state — completely detached from the global task list`,
    `  const [draft, setDraft] = useState<Task>(task);`,
    `  const [isSaving, setIsSaving] = useState(false);`,
    `  const [error, setError] = useState<string | null>(null);`,
    ``,
    `  // Sync draft if the parent task changes while form is open`,
    `  useEffect(() => {`,
    `    setDraft(task);`,
    `    setError(null);`,
    `  }, [task]);`,
    ``,
    `  const handleSubmit = async (e: React.FormEvent) => {`,
    `    e.preventDefault();`,
    `    setIsSaving(true);`,
    `    setError(null);`,
    `    try {`,
    `      const updatedTask = await updateTaskInDatabase(draft, forceError);`,
    `      // Synchronize back to global state ONLY after API success`,
    `      onSaveSuccess(updatedTask);`,
    `    } catch (err) {`,
    `      setError(err.message);`,
    `    } finally {`,
    `      setIsSaving(false);`,
    `    }`,
    `  };`,
    ``,
    `  return <form onSubmit={handleSubmit}>...</form>;`,
    `}`,
].join("\n");

const compoundComponentCode = [
    `export function DataGrid({ children }: { children: ReactNode }) {`,
    `  return (`,
    `    <div className="w-full overflow-hidden rounded-lg border ...">`,
    `      <table className="w-full text-left text-sm text-zinc-300">`,
    `        {children}`,
    `      </table>`,
    `    </div>`,
    `  );`,
    `}`,
    ``,
    `DataGrid.Header = function DataGridHeader({ children }) {`,
    `  return (`,
    `    <thead className="bg-black/60 text-xs uppercase text-zinc-400 ...">`,
    `      <tr>{children}</tr>`,
    `    </thead>`,
    `  );`,
    `};`,
    ``,
    `DataGrid.Body = function DataGridBody({ children }) {`,
    `  return <tbody>{children}</tbody>;`,
    `};`,
    ``,
    `DataGrid.Row = function DataGridRow({ children, onClick, active }) {`,
    `  return (`,
    `    <tr onClick={onClick} className={...}>`,
    `      {children}`,
    `    </tr>`,
    `  );`,
    `};`,
    ``,
    `DataGrid.Cell = function DataGridCell({ children, isHeader }) {`,
    `  if (isHeader) return <th>{children}</th>;`,
    `  return <td>{children}</td>;`,
    `};`,
].join("\n");

const mockApiCode = [
    `// Mock API Call — artificial delay with configurable error`,
    `const updateTaskInDatabase = (`,
    `  task: Task,`,
    `  shouldFail: boolean`,
    `): Promise<Task> => {`,
    `  return new Promise((resolve, reject) => {`,
    `    setTimeout(() => {`,
    `      if (shouldFail) {`,
    `        reject(new Error("Network Error: Failed to update task"));`,
    `      } else {`,
    `        resolve(task);`,
    `      }`,
    `    }, 1500); // 1.5s artificial delay`,
    `  });`,
    `};`,
].join("\n");

const globalSyncCode = [
    `function WorkflowDashboardDemo() {`,
    `  const [tasks, setTasks] = useState<Task[]>(INITIAL_DATA);`,
    `  const [selectedTask, setSelectedTask] = useState<Task | null>(null);`,
    ``,
    `  // Global state is ONLY updated on successful save`,
    `  const handleSaveSuccess = (updatedTask: Task) => {`,
    `    setTasks((prev) =>`,
    `      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))`,
    `    );`,
    `    setSelectedTask(null); // Close slide-over`,
    `  };`,
    ``,
    `  const handleClose = () => setSelectedTask(null);`,
    ``,
    `  return (`,
    `    <>`,
    `      <DataGrid>...</DataGrid>`,
    `      <SlideOver isOpen={!!selectedTask} onClose={handleClose}>`,
    `        <EditTaskForm`,
    `          task={selectedTask}`,
    `          onCancel={handleClose}`,
    `          onSaveSuccess={handleSaveSuccess}`,
    `        />`,
    `      </SlideOver>`,
    `    </>`,
    `  );`,
    `}`,
].join("\n");

const items = [
    {
        title: "State isolation — local draft form",
        description:
            "The edit form maintains strictly local state. The parent data grid never sees uncommitted changes, preventing accidental state leakage.",
        language: "tsx" as const,
        code: stateIsolationCode,
    },
    {
        title: "Compound DataGrid component",
        description:
            "The grid uses a compound component pattern (DataGrid.Header, DataGrid.Row, etc.) for maximum flexibility while enforcing consistent enterprise styling.",
        language: "tsx" as const,
        code: compoundComponentCode,
    },
    {
        title: "Mock API with configurable error",
        description:
            "An artificial 1.5s delay simulates real network latency. The forceError flag lets you test failure paths without a real backend.",
        language: "ts" as const,
        code: mockApiCode,
    },
    {
        title: "Global state synchronization",
        description:
            "The parent only updates its task list after the API promise resolves. On cancel or error, the global state remains untouched.",
        language: "tsx" as const,
        code: globalSyncCode,
    },
];

export default function WorkflowDashboardCodeTab() {
    return (
        <div className="space-y-6">
            <p className="text-sm text-zinc-300">
                Key code excerpts from the workflow dashboard. The snippets highlight the
                architectural decisions behind state isolation, compound components, and
                mock API handling.
            </p>

            <CodePane items={items} />

            <p className="text-xs text-zinc-400">
                Want more? The full source lives in GitHub — links are available in the repository overview.
            </p>
            <Link
                className="inline-flex text-xs font-medium text-[#ff8820] hover:underline"
                href="https://github.com/Eduardo-YGIAH/Eduardo-Neto-2025-26/tree/main/app/components/use-cases/workflow-dashboard"
                target="_blank"
                rel="noreferrer"
            >
                View the Workflow Dashboard source on GitHub ↗
            </Link>
        </div>
    );
}
