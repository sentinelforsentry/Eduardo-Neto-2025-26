// @vitest-environment jsdom

import { render, screen, within, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { WorkflowDashboardDemo } from "../WorkflowDashboardDemo";

describe("WorkflowDashboardDemo", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("renders the initial data grid correctly", () => {
        render(<WorkflowDashboardDemo />);
        expect(screen.getByText("Acme Corp")).toBeInTheDocument();
        expect(screen.getByText("Globex Inc")).toBeInTheDocument();
    });

    it("opens the slide-over form when a row is clicked", () => {
        render(<WorkflowDashboardDemo />);

        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));

        expect(screen.getByRole("dialog", { name: /edit task: txn-001/i })).toBeInTheDocument();
        const clientNameInput = screen.getByTestId("edit-client-name");
        expect(clientNameInput).toHaveValue("Acme Corp");
    });

    it("exposes a named close button for the edit dialog", () => {
        render(<WorkflowDashboardDemo />);

        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));
        fireEvent.click(screen.getByRole("button", { name: /close edit dialog/i }));

        expect(screen.queryByRole("dialog", { name: /edit task: txn-001/i })).not.toBeInTheDocument();
    });

    it("isolates state: changes in form do not immediately update the grid", () => {
        render(<WorkflowDashboardDemo />);

        const rows = screen.getAllByTestId("data-grid-row");
        // Row 1 is Acme Corp
        within(rows[0]).getByText("Acme Corp");

        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));
        const input = screen.getByTestId("edit-client-name");

        fireEvent.change(input, { target: { value: "Acme Corp Edited" } });

        // The grid should still show "Acme Corp" because state is isolated
        expect(within(rows[0]).queryByText("Acme Corp Edited")).not.toBeInTheDocument();
        expect(within(rows[0]).getByText("Acme Corp")).toBeInTheDocument();
    });

    it("closes the form and discards changes on cancel", () => {
        render(<WorkflowDashboardDemo />);

        // Open Row
        const rows = screen.getAllByTestId("data-grid-row");
        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));

        // Edit Name
        const input = screen.getByTestId("edit-client-name");
        fireEvent.change(input, { target: { value: "Test Cancel" } });

        // Click Cancel
        fireEvent.click(screen.getByTestId("cancel-edit"));

        // Form is closed
        expect(screen.queryByRole("dialog", { name: /edit task: txn-001/i })).not.toBeInTheDocument();

        // Original data remains
        expect(within(rows[0]).getByText("Acme Corp")).toBeInTheDocument();
    });

    it("shows loading state, simulates api delay, and optimistically updates grid on success", async () => {
        render(<WorkflowDashboardDemo />);

        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));

        const input = screen.getByTestId("edit-client-name");
        fireEvent.change(input, { target: { value: "Acme Saved" } });

        const saveButton = screen.getByTestId("save-edit");
        fireEvent.click(saveButton);

        // Assert saving state
        expect(screen.getByText(/saving.../i)).toBeInTheDocument();
        expect(saveButton).toBeDisabled();

        // Advance timers to trigger successful API response
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        // Wait for the form to close and grid to update
        expect(screen.queryByRole("dialog", { name: /edit task: txn-001/i })).not.toBeInTheDocument();

        // Validates optimistic state sync on successful response
        expect(screen.getByText("Acme Saved")).toBeInTheDocument();
        expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument();
    });

    it("does not close a newer edit dialog when an earlier save completes", async () => {
        render(<WorkflowDashboardDemo />);

        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));
        fireEvent.change(screen.getByTestId("edit-client-name"), { target: { value: "Acme Saved" } });
        fireEvent.click(screen.getByTestId("save-edit"));

        fireEvent.click(screen.getByRole("button", { name: /close edit dialog/i }));
        fireEvent.click(screen.getByRole("button", { name: /edit task txn-002 for globex inc/i }));

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        expect(screen.getByRole("dialog", { name: /edit task: txn-002/i })).toBeInTheDocument();
        expect(screen.getByTestId("edit-client-name")).toHaveValue("Globex Inc");
        expect(screen.getByText("Acme Saved")).toBeInTheDocument();
    });

    it("shows error state and does not update parent grid on API failure", async () => {
        render(<WorkflowDashboardDemo />);

        const rows = screen.getAllByTestId("data-grid-row");
        fireEvent.click(screen.getByRole("button", { name: /edit task txn-001 for acme corp/i }));

        const input = screen.getByTestId("edit-client-name");
        fireEvent.change(input, { target: { value: "Acme Error" } });

        // Check "Simulate API Error"
        const errorCheckbox = screen.getByTestId("force-error-checkbox");
        fireEvent.click(errorCheckbox);

        const saveButton = screen.getByTestId("save-edit");
        fireEvent.click(saveButton);

        // Fast forward mock api delay
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1500);
        });

        // Error message appears
        expect(screen.getByRole("alert")).toHaveTextContent("Network Error: Failed to update task");

        // Form remains open
        expect(screen.getByRole("dialog", { name: /edit task: txn-001/i })).toBeInTheDocument();

        // Data grid is unmodified
        expect(within(rows[0]).getByText("Acme Corp")).toBeInTheDocument();
        expect(within(rows[0]).queryByText("Acme Error")).not.toBeInTheDocument();
    });
});
