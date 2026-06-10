import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
  getSortedRowModel, useReactTable, type ColumnDef, type ColumnFiltersState, type SortingState,
} from "@tanstack/react-table";
import {
  MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon, ArrowDownTrayIcon,
  FunnelIcon, EyeIcon, PencilSquareIcon, TrashIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export interface DTFilter {
  id: string;        // column id / accessor key
  label: string;
  options: string[];
}

interface Props<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  emptyText?: string;
  exportFilename?: string;
  filters?: DTFilter[];
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

function toCSV<T>(rows: T[], cols: ColumnDef<T, unknown>[], filename: string) {
  const usable = cols.filter((c) => "accessorKey" in c && typeof c.header === "string");
  const headers = usable.map((c) => String(c.header));
  const keys = usable.map((c) => (c as { accessorKey: string }).accessorKey);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  rows.forEach((r) => lines.push(keys.map((k) => escape((r as Record<string, unknown>)[k])).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}.csv`; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  data, columns, searchPlaceholder = "Search…", toolbar, emptyText = "No records.",
  exportFilename = "export", filters, onRowClick, onView, onEdit, onDelete,
}: Props<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const finalColumns = useMemo<ColumnDef<T, unknown>[]>(() => {
    if (!onView && !onEdit && !onDelete) return columns;
    const actionsCol: ColumnDef<T, unknown> = {
      id: "__actions",
      header: () => <span className="text-right block">Actions</span>,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
          {onView && (
            <button onClick={() => onView(row.original)}
              className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title="View">
              <EyeIcon className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button onClick={() => onEdit(row.original)}
              className="p-1.5 rounded-md hover:bg-accent/10 text-accent" title="Edit">
              <PencilSquareIcon className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(row.original)}
              className="p-1.5 rounded-md hover:bg-danger/10 text-danger" title="Delete">
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    };
    return [...columns, actionsCol];
  }, [columns, onView, onEdit, onDelete]);

  const table = useReactTable({
    data, columns: finalColumns,
    state: { globalFilter, sorting, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filteredRows = table.getFilteredRowModel().rows.map((r) => r.original);
  const setFilter = (id: string, value: string) => {
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (value) next.push({ id, value });
      return next;
    });
  };
  const activeFilters = columnFilters.length;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border/60">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {toolbar}
          {filters && filters.length > 0 && (
            <Popover className="relative">
              <PopoverButton className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition">
                <FunnelIcon className="w-4 h-4" /> Filter
                {activeFilters > 0 && (
                  <span className="ml-1 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{activeFilters}</span>
                )}
              </PopoverButton>
              <PopoverPanel anchor="bottom end" className="z-50 mt-2 w-72 glass-card rounded-xl p-4 shadow-elegant space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Filters</p>
                  {activeFilters > 0 && (
                    <button onClick={() => setColumnFilters([])} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      <XMarkIcon className="w-3 h-3" /> Clear all
                    </button>
                  )}
                </div>
                {filters.map((f) => {
                  const current = (columnFilters.find((c) => c.id === f.id)?.value as string) ?? "";
                  return (
                    <div key={f.id}>
                      <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                      <select value={current} onChange={(e) => setFilter(f.id, e.target.value)}
                        className="mt-1 w-full px-2 py-1.5 rounded-md border border-border bg-background text-sm focus:border-primary outline-none">
                        <option value="">All</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                })}
              </PopoverPanel>
            </Popover>
          )}
          <button
            onClick={() => toCSV(filteredRows, columns, exportFilename)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-left font-semibold px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground select-none">
                    {h.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === "asc" && <ChevronUpIcon className="w-3 h-3" />}
                        {h.column.getIsSorted() === "desc" && <ChevronDownIcon className="w-3 h-3" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={finalColumns.length} className="text-center py-10 text-muted-foreground">{emptyText}</td></tr>
            ) : table.getRowModel().rows.map((row) => (
              <tr key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={`border-t border-border/60 hover:bg-muted/30 transition ${onRowClick ? "cursor-pointer" : ""}`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 p-4 border-t border-border/60 text-sm">
        <p className="text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1} · {table.getFilteredRowModel().rows.length} records
        </p>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted">Previous</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted">Next</button>
        </div>
      </div>
    </div>
  );
}
