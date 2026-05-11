"use client";

import React, { useState } from "react";
import { DataGrid } from "./DataGrid";
import { EditModal } from "./SlideOver";

export type Task = {
    id: string;
    clientName: string;
    status: "Pending" | "In Progress" | "Completed" | "Under Review";
    amount: number;
    lastUpdated: string;
};

const INITIAL_DATA: Task[] = [
    {
        id: "TXN-001",
        clientName: "Acme Corp",
        status: "Pending",
        amount: 1500000,
        lastUpdated: "2026-02-21",
    },
    {
        id: "TXN-002",
        clientName: "Globex Inc",
        status: "In Progress",
        amount: 850000,
        lastUpdated: "2026-02-20",
    },
    {
        id: "TXN-003",
        clientName: "Initech",
        status: "Under Review",
        amount: 3200000,
        lastUpdated: "2026-02-19",
    },
    {
        id: "TXN-004",
        clientName: "Soylent Corp",
        status: "Completed",
        amount: 45000,
        lastUpdated: "2026-02-18",
    },
];

// Mock API Call
const updateTaskInDatabase = (task: Task, shouldFail: boolean): Promise<Task> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Network Error: Failed to update task"));
            } else {
                resolve(task);
            }
        }, 1500); // 1.5s artificial delay
    });
};

export function WorkflowDashboardDemo() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_DATA);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // When a row is clicked, open the slide-over
    const handleRowClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleClose = () => {
        setSelectedTask(null);
    };

    const handleSaveSuccess = (updatedTask: Task) => {
        // Synchronize global state
        setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
        setSelectedTask(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Commercial Tasks</h2>
                <div className="text-sm text-zinc-400">Total: {tasks.length}</div>
            </div>

            <DataGrid>
                <DataGrid.Header>
                    <DataGrid.Cell isHeader>ID</DataGrid.Cell>
                    <DataGrid.Cell isHeader>Client Name</DataGrid.Cell>
                    <DataGrid.Cell isHeader>Amount (USD)</DataGrid.Cell>
                    <DataGrid.Cell isHeader>Status</DataGrid.Cell>
                    <DataGrid.Cell isHeader>Last Updated</DataGrid.Cell>
                    <DataGrid.Cell isHeader>Actions</DataGrid.Cell>
                </DataGrid.Header>
                <DataGrid.Body>
                    {tasks.map((task) => (
                        <DataGrid.Row
                            key={task.id}
                            active={selectedTask?.id === task.id}
                        >
                            <DataGrid.Cell>{task.id}</DataGrid.Cell>
                            <DataGrid.Cell>
                                <span className="font-medium text-white">{task.clientName}</span>
                            </DataGrid.Cell>
                            <DataGrid.Cell>
                                ${task.amount.toLocaleString()}
                            </DataGrid.Cell>
                            <DataGrid.Cell>
                                <StatusBadge status={task.status} />
                            </DataGrid.Cell>
                            <DataGrid.Cell>{task.lastUpdated}</DataGrid.Cell>
                            <DataGrid.Cell>
                                <button
                                    type="button"
                                    onClick={() => handleRowClick(task)}
                                    className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-[#ff8820] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff8820]"
                                    aria-label={`Edit task ${task.id} for ${task.clientName}`}
                                >
                                    Edit
                                </button>
                            </DataGrid.Cell>
                        </DataGrid.Row>
                    ))}
                </DataGrid.Body>
            </DataGrid>

            <EditModal
                isOpen={!!selectedTask}
                onClose={handleClose}
                title={`Edit Task: ${selectedTask?.id}`}
            >
                {selectedTask && (
                    <EditTaskForm
                        key={selectedTask.id}
                        task={selectedTask}
                        onCancel={handleClose}
                        onSaveSuccess={handleSaveSuccess}
                    />
                )}
            </EditModal>
        </div>
    );
}

function StatusBadge({ status }: { status: Task["status"] }) {
    const colors = {
        Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
        "Under Review": "bg-purple-500/10 text-purple-400 border-purple-500/20",
        Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
        >
            {status}
        </span>
    );
}

// Ensure Edit form state is isolated
function EditTaskForm({
    task,
    onCancel,
    onSaveSuccess,
}: {
    task: Task;
    onCancel: () => void;
    onSaveSuccess: (updatedTask: Task) => void;
}) {
    // Local state - strictly isolated from the parent data grid
    const [draft, setDraft] = useState<Task>(task);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forceError, setForceError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            // Mock API call
            const updatedTask = await updateTaskInDatabase(
                {
                    ...draft,
                    lastUpdated: new Date().toISOString().split("T")[0],
                },
                forceError
            );
            onSaveSuccess(updatedTask);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <div className="flex-1 space-y-6 px-6 py-6">
                {error && (
                    <div
                        className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-zinc-300">
                        Client Name
                    </label>
                    <input
                        type="text"
                        value={draft.clientName}
                        onChange={(e) => setDraft({ ...draft, clientName: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-500 shadow-sm focus:border-[#ff8820] focus:outline-none focus:ring-1 focus:ring-[#ff8820] sm:text-sm"
                        required
                        data-testid="edit-client-name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300">
                        Amount (USD)
                    </label>
                    <input
                        type="number"
                        value={draft.amount}
                        onChange={(e) =>
                            setDraft({ ...draft, amount: Number(e.target.value) })
                        }
                        className="mt-1 block w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-white placeholder-zinc-500 shadow-sm focus:border-[#ff8820] focus:outline-none focus:ring-1 focus:ring-[#ff8820] sm:text-sm"
                        required
                        data-testid="edit-amount"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300">
                        Status
                    </label>
                    <select
                        value={draft.status}
                        onChange={(e) =>
                            setDraft({ ...draft, status: e.target.value as Task["status"] })
                        }
                        className="mt-1 block w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-white shadow-sm focus:border-[#ff8820] focus:outline-none focus:ring-1 focus:ring-[#ff8820] sm:text-sm"
                        data-testid="edit-status"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
                    <input
                        type="checkbox"
                        id="forceError"
                        checked={forceError}
                        onChange={(e) => setForceError(e.target.checked)}
                        className="rounded border-white/10 bg-black/50 text-[#ff8820] focus:ring-[#ff8820]"
                        data-testid="force-error-checkbox"
                    />
                    <label htmlFor="forceError" className="text-sm text-zinc-400">
                        Simulate API Error
                    </label>
                </div>
            </div>

            <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-white/10 px-6 py-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 shadow-sm hover:bg-white/5 focus:outline-none disabled:opacity-50"
                    data-testid="cancel-edit"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center rounded-md border border-transparent bg-[#ff8820] px-4 py-2 text-sm font-medium text-black shadow-sm hover:brightness-110 focus:outline-none disabled:opacity-50"
                    data-testid="save-edit"
                >
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </div>
        </form>
    );
}
