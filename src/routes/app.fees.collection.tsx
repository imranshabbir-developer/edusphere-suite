import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { fees, revenueData, type FeeRecord } from "@/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/fees/collection")({ component: FeesPage });

function FeesPage() {
  const columns: ColumnDef<FeeRecord>[] = [
    { header: "Invoice", accessorKey: "invoice" },
    { header: "Student", accessorKey: "student" },
    { header: "Program", accessorKey: "program" },
    { header: "Total", accessorKey: "amount", cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}` },
    { header: "Paid", accessorKey: "paid", cell: ({ getValue }) => <span className="text-success">${Number(getValue()).toLocaleString()}</span> },
    { header: "Due", accessorKey: "due", cell: ({ getValue }) => <span className="font-semibold">${Number(getValue()).toLocaleString()}</span> },
    { header: "Due Date", accessorKey: "dueDate", cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString() },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
    { header: "", id: "act", cell: () => <button className="text-xs px-2 py-1 rounded-md gradient-primary text-primary-foreground">Collect</button> },
  ];

  const total = fees.reduce((a, b) => a + b.amount, 0);
  const paid = fees.reduce((a, b) => a + b.paid, 0);
  const due = total - paid;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fee Collection</h1>
        <p className="text-muted-foreground text-sm">Track collections, invoices and outstanding dues.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Billed" value={`$${(total/1000).toFixed(0)}K`} icon="BanknotesIcon" tone="primary" />
        <StatsCard title="Collected" value={`$${(paid/1000).toFixed(0)}K`} icon="CheckBadgeIcon" tone="success" delta={9} />
        <StatsCard title="Outstanding" value={`$${(due/1000).toFixed(0)}K`} icon="ClockIcon" tone="warning" />
        <StatsCard title="Overdue" value={fees.filter(f => f.status === "Overdue").length} icon="ExclamationTriangleIcon" tone="danger" />
      </div>
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Monthly Collection</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="revenue" fill="oklch(0.585 0.214 263)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable data={fees} columns={columns} searchPlaceholder="Search by student, invoice…" />
    </div>
  );
}
