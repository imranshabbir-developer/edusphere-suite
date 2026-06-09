import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { admissions, admissionFunnel, type Admission } from "@/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/admissions/applications")({ component: AdmissionsPage });

function AdmissionsPage() {
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
    { header: "", id: "act", cell: () => <button className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">Review</button> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground text-sm">Manage incoming admission applications.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Applications" value={admissions.length} icon="ClipboardDocumentCheckIcon" tone="primary" delta={11} />
        <StatsCard title="Under Review" value={admissions.filter(a => a.status === "Under Review").length} icon="EyeIcon" tone="warning" />
        <StatsCard title="Approved" value={admissions.filter(a => a.status === "Approved").length} icon="CheckBadgeIcon" tone="success" delta={6} />
        <StatsCard title="Rejected" value={admissions.filter(a => a.status === "Rejected").length} icon="XCircleIcon" tone="danger" />
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
      <DataTable data={admissions} columns={columns} searchPlaceholder="Search applications…" />
    </div>
  );
}
