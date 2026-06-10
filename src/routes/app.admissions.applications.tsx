import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecordFormModal, RecordDetailModal, ConfirmDialog, type FieldDef } from "@/components/ui/RecordDialogs";
import { admissions as seed, admissionFunnel, type Admission } from "@/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const Route = createFileRoute("/app/admissions/applications")({ component: AdmissionsPage });

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const STATUSES: Admission["status"][] = ["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"];

function AdmissionsPage() {
  const [data, setData] = useState<Admission[]>(seed);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Admission | null>(null);
  const [viewing, setViewing] = useState<Admission | null>(null);
  const [deleting, setDeleting] = useState<Admission | null>(null);

  const fields: FieldDef[] = [
    { key: "applicant", label: "Applicant name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "score", label: "Score", type: "number" },
    { key: "documents", label: "Documents", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    if (editing) setData((d) => d.map((a) => a.id === editing.id ? { ...a, ...v } as Admission : a));
    else setData((d) => [{
      id: `ADM-${Date.now().toString().slice(-5)}`,
      applicant: String(v.applicant ?? "New Applicant"),
      email: String(v.email ?? ""),
      program: String(v.program ?? PROGRAMS[0]),
      appliedOn: new Date().toISOString(),
      status: (v.status as Admission["status"]) ?? "Submitted",
      score: Number(v.score ?? 70),
      documents: Number(v.documents ?? 3),
    }, ...d]);
    setEditing(null);
  };

  const columns: ColumnDef<Admission>[] = [
    { header: "App ID", accessorKey: "id" },
    {
      header: "Applicant", accessorKey: "applicant",
      cell: ({ row }) => <div><p className="font-medium">{row.original.applicant}</p><p className="text-xs text-muted-foreground">{row.original.email}</p></div>,
    },
    { header: "Program", accessorKey: "program" },
    { header: "Applied", accessorKey: "appliedOn", cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString() },
    { header: "Docs", accessorKey: "documents" },
    { header: "Score", accessorKey: "score", cell: ({ getValue }) => <span className="font-semibold">{String(getValue())}/100</span> },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground text-sm">Manage incoming admission applications.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New Application
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Applications" value={data.length} icon="ClipboardDocumentCheckIcon" tone="primary" delta={11} />
        <StatsCard title="Under Review" value={data.filter(a => a.status === "Under Review").length} icon="EyeIcon" tone="warning" />
        <StatsCard title="Approved" value={data.filter(a => a.status === "Approved").length} icon="CheckBadgeIcon" tone="success" delta={6} />
        <StatsCard title="Rejected" value={data.filter(a => a.status === "Rejected").length} icon="XCircleIcon" tone="danger" />
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Admission Funnel</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={admissionFunnel}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="value" fill="oklch(0.585 0.214 263)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        data={data} columns={columns} searchPlaceholder="Search applications…"
        exportFilename="admissions"
        filters={[
          { id: "program", label: "Program", options: PROGRAMS },
          { id: "status", label: "Status", options: STATUSES as unknown as string[] },
        ]}
        onRowClick={(a) => setViewing(a)}
        onView={(a) => setViewing(a)}
        onEdit={(a) => { setEditing(a); setFormOpen(true); }}
        onDelete={(a) => setDeleting(a)}
      />

      <RecordFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit application" : "New application"} fields={fields} initial={editing ?? undefined}
        onSubmit={submit} submitLabel={editing ? "Save changes" : "Create application"} />
      <RecordDetailModal open={!!viewing} onClose={() => setViewing(null)}
        title={viewing?.applicant ?? "Application"} record={viewing as unknown as Record<string, unknown>} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setData((d) => d.filter((x) => x.id !== deleting.id))}
        message={`Delete application from "${deleting?.applicant}"?`} />
    </div>
  );
}
