import { useParams } from "@tanstack/react-router";
import { useAppSelector } from "@/store/store";
import { SIDEBAR } from "@/global/AppLayout/sidebarConfig";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { RecordFormModal, RecordDetailModal, ConfirmDialog, type FieldDef } from "@/components/ui/RecordDialogs";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMemo, useState, useEffect } from "react";



interface Row {
  id: string; name: string; reference: string; owner: string;
  category: string; status: string; updated: string; value: number;
  [k: string]: unknown;
}

const CATS = ["General", "Tier 1", "Tier 2", "Priority", "Standard"];
const STATUSES = ["Active", "Pending", "Completed", "Draft", "Archived"];
const OWNERS = ["Alex Morgan", "Priya Sharma", "Daniel Reyes", "Jane Doe", "Mark Lee"];

function seedRows(seed: string): Row[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: 24 }).map((_, i) => {
    const v = (h + i * 7) % 1000;
    return {
      id: `${seed.slice(0, 3).toUpperCase()}-${1000 + i}`,
      name: `${seed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Record ${i + 1}`,
      reference: `REF-${v}${i}`,
      owner: OWNERS[(h + i) % OWNERS.length],
      category: CATS[(h + i * 3) % CATS.length],
      status: STATUSES[(h + i * 5) % STATUSES.length],
      updated: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      value: 1000 + ((h + i * 137) % 9000),
    };
  });
}

export default function GenericModule() {
  const params = useParams({ from: "/$role/$" });
  const splat = (params as { _splat?: string })._splat ?? "";
  const urlRole = (params as { role?: string }).role ?? "admin";
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const path = `/${urlRole}/${splat}`;
  const { groupLabel, label } = useMemo(() => {
    for (const g of SIDEBAR[role]) {
      const found = g.items.find((i) => i.to === path);
      if (found) return { groupLabel: g.label, label: found.label };
    }
    const seg = splat.split("/").filter(Boolean);
    return { groupLabel: seg[0]?.replace(/-/g, " ") ?? "Module", label: seg[seg.length - 1]?.replace(/-/g, " ") ?? "Page" };
  }, [path, role, splat]);

  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => { setRows(seedRows(splat || "module")); }, [splat]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  const cap = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const labelCap = cap(label);

  const fields: FieldDef[] = [
    { key: "name", label: "Name", required: true, span: 2 },
    { key: "reference", label: "Reference" },
    { key: "owner", label: "Owner", type: "select", options: OWNERS },
    { key: "category", label: "Category", type: "select", options: CATS },
    { key: "status", label: "Status", type: "select", options: STATUSES },
    { key: "value", label: "Value", type: "number" },
    { key: "updated", label: "Date", type: "date" },
  ];

  const submit = (vals: Record<string, unknown>) => {
    if (editing) {
      setRows((r) => r.map((x) => x.id === editing.id ? { ...x, ...vals } as Row : x));
    } else {
      const id = `${splat.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
      setRows((r) => [{
        id, name: String(vals.name ?? "Untitled"),
        reference: String(vals.reference ?? `REF-${Date.now().toString().slice(-4)}`),
        owner: String(vals.owner ?? OWNERS[0]),
        category: String(vals.category ?? CATS[0]),
        status: String(vals.status ?? "Active"),
        updated: vals.updated ? String(vals.updated) : new Date().toLocaleDateString(),
        value: Number(vals.value ?? 0),
      }, ...r]);
    }
    setEditing(null);
  };

  const columns: ColumnDef<Row>[] = [
    { header: "ID", accessorKey: "id", cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
    { header: "Name", accessorKey: "name" },
    { header: "Reference", accessorKey: "reference" },
    { header: "Category", accessorKey: "category", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Owner", accessorKey: "owner" },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
    { header: "Updated", accessorKey: "updated" },
    { header: "Value", accessorKey: "value", cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}` },
  ];

  const totals = useMemo(() => {
    const active = rows.filter((r) => r.status === "Active").length;
    const pending = rows.filter((r) => r.status === "Pending").length;
    const val = rows.reduce((a, b) => a + b.value, 0);
    return { active, pending, val };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{cap(groupLabel)}</p>
          <h1 className="text-2xl font-bold tracking-tight">{labelCap}</h1>
          <p className="text-muted-foreground text-sm">Manage {labelCap.toLowerCase()} across your organization.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New {labelCap.replace(/s$/, "")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Records" value={rows.length} icon="Squares2X2Icon" tone="primary" delta={4} />
        <StatsCard title="Active" value={totals.active} icon="CheckBadgeIcon" tone="success" delta={2} />
        <StatsCard title="Pending" value={totals.pending} icon="ClockIcon" tone="warning" />
        <StatsCard title="Total Value" value={`$${(totals.val / 1000).toFixed(1)}K`} icon="BanknotesIcon" tone="accent" delta={7} />
      </div>

      <DataTable
        data={rows} columns={columns}
        searchPlaceholder={`Search ${labelCap.toLowerCase()}…`}
        exportFilename={splat.replace(/\//g, "-") || "records"}
        filters={[
          { id: "status", label: "Status", options: STATUSES },
          { id: "category", label: "Category", options: CATS },
          { id: "owner", label: "Owner", options: OWNERS },
        ]}
        onRowClick={(r) => setViewing(r)}
        onView={(r) => setViewing(r)}
        onEdit={(r) => { setEditing(r); setFormOpen(true); }}
        onDelete={(r) => setDeleting(r)}
      />

      <RecordFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? `Edit ${labelCap}` : `Create new ${labelCap.replace(/s$/, "").toLowerCase()}`}
        fields={fields}
        initial={editing ?? undefined}
        onSubmit={submit}
        submitLabel={editing ? "Save changes" : "Create"}
      />
      <RecordDetailModal
        open={!!viewing} onClose={() => setViewing(null)}
        title={viewing?.name ?? "Record details"}
        record={viewing as unknown as Record<string, unknown>}
      />
      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setRows((r) => r.filter((x) => x.id !== deleting.id))}
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
