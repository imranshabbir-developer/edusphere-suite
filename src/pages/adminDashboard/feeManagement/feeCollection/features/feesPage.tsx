
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecordFormModal, type FieldDef } from "@/components/ui/RecordDialogs";
import { ConfirmDeleteModal } from "@/components/records/ConfirmDeleteModal";
import { ActionFeedbackModal, type FeedbackAction } from "@/components/records/ActionFeedbackModal";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { useAppSelector } from "@/store/store";
import { fees as seed, revenueData, type FeeRecord } from "@/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const STATUSES: FeeRecord["status"][] = ["Paid", "Partial", "Overdue"];

export default function FeesPage() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();
  const storageKey = `${role}/fees/collection`;
  const [data, setData] = usePersistedRecords<FeeRecord>(storageKey, seed);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<FeeRecord | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/fees/collection/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const fields: FieldDef[] = [
    { key: "student", label: "Student name", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "invoice", label: "Invoice #" },
    { key: "amount", label: "Total amount", type: "number" },
    { key: "paid", label: "Paid", type: "number" },
    { key: "dueDate", label: "Due date", type: "date" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    const amount = Number(v.amount ?? 0);
    const paid = Number(v.paid ?? 0);
    const status: FeeRecord["status"] = paid >= amount && amount > 0 ? "Paid" : paid > 0 ? "Partial" : "Overdue";
    const inv = String(v.invoice || `INV-${Date.now().toString().slice(-5)}`);
    setData((d) => [{
      id: inv,
      student: String(v.student ?? "New Student"),
      program: String(v.program ?? PROGRAMS[0]),
      amount, paid, due: amount - paid,
      status: (v.status as FeeRecord["status"]) ?? status,
      dueDate: v.dueDate ? new Date(String(v.dueDate)).toISOString() : new Date().toISOString(),
      invoice: inv,
    }, ...d]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
  };

  const columns: ColumnDef<FeeRecord>[] = [
    { header: "Invoice", accessorKey: "invoice" },
    { header: "Student", accessorKey: "student" },
    { header: "Program", accessorKey: "program" },
    { header: "Total", accessorKey: "amount", cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}` },
    { header: "Paid", accessorKey: "paid", cell: ({ getValue }) => <span className="text-success">${Number(getValue()).toLocaleString()}</span> },
    { header: "Due", accessorKey: "due", cell: ({ getValue }) => <span className="font-semibold">${Number(getValue()).toLocaleString()}</span> },
    { header: "Due Date", accessorKey: "dueDate", cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString() },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  const total = data.reduce((a, b) => a + b.amount, 0);
  const paid = data.reduce((a, b) => a + b.paid, 0);
  const due = total - paid;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fee Collection</h1>
          <p className="text-muted-foreground text-sm">Track collections, invoices and outstanding dues.</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New Invoice
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Billed" value={`$${(total/1000).toFixed(0)}K`} icon="BanknotesIcon" tone="primary" />
        <StatsCard title="Collected" value={`$${(paid/1000).toFixed(0)}K`} icon="CheckBadgeIcon" tone="success" delta={9} />
        <StatsCard title="Outstanding" value={`$${(due/1000).toFixed(0)}K`} icon="ClockIcon" tone="warning" />
        <StatsCard title="Overdue" value={data.filter(f => f.status === "Overdue").length} icon="ExclamationTriangleIcon" tone="danger" />
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
      <DataTable
        data={data} columns={columns} searchPlaceholder="Search by student, invoice…"
        exportFilename="fees"
        filters={[
          { id: "program", label: "Program", options: PROGRAMS },
          { id: "status", label: "Status", options: STATUSES as unknown as string[] },
        ]}
        onRowClick={(f) => goDetail(f.id)}
        onView={(f) => goDetail(f.id)}
        onEdit={(f) => goDetail(f.id, true)}
        onDelete={(f) => setDeleting(f)}
      />

      <RecordFormModal open={formOpen} onClose={() => setFormOpen(false)}
        title="Create new invoice" fields={fields} onSubmit={submit} submitLabel="Create invoice" />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) setData((d) => d.filter((x) => x.id !== deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting?.invoice} />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
