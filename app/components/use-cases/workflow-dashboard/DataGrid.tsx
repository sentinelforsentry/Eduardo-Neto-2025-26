"use client";

import React, { ReactNode } from "react";

export function DataGrid({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/45 shadow-sm">
      <table className="w-full text-left text-sm text-zinc-300">
        {children}
      </table>
    </div>
  );
}

DataGrid.Header = function DataGridHeader({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-black/60 text-xs uppercase text-zinc-400 border-b border-white/10">
      <tr>{children}</tr>
    </thead>
  );
};

DataGrid.Body = function DataGridBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
};

DataGrid.Row = function DataGridRow({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <tr
      data-testid="data-grid-row"
      className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
        active ? "bg-white/10" : ""
      }`}
    >
      {children}
    </tr>
  );
};

DataGrid.Cell = function DataGridCell({
  children,
  isHeader = false,
}: {
  children: ReactNode;
  isHeader?: boolean;
}) {
  if (isHeader) {
    return (
      <th scope="col" className="px-6 py-4 font-medium">
        {children}
      </th>
    );
  }
  return <td className="px-6 py-4">{children}</td>;
};
