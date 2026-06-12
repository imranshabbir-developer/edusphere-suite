
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
import { admissions as seed, admissionFunnel, type Admission } from "@/mockData";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const STATUSES: Admission["status"][] = ["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"];

export default function AdmissionsPage() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();
  const storageKey = `${role}/admissions/applications`;
  const [data, setData] = usePersistedRecords<Admission>(storageKey, seed);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Admission | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/admissions/applications/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const fields: FieldDef[] = [
    { key: "applicant", label: "Applicant name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "score", label: "Score", type: "number" },
    { key: "documents", label: "Documents", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    setData((d) => [{
      id: `ADM-${Date.now().toString().slice(-5)}`,
      applicant: String(v.applicant ?? "New Applicant"),
      email: String(v.email ?? ""),
      program: String(v.program ?? PROGRAMS[0]),
      appliedOn: new Date().toISOString(),
      status: (v.status as Admission["status"]) ?? "Submitted",
      score: Number(v.score ?? 70),
      documents: Number(v.documents ?? 3),
    }, ...d]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
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
        <button onClick={() => setFormOpen(true)}
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
        onRowClick={(a) => goDetail(a.id)}
        onView={(a) => goDetail(a.id)}
        onEdit={(a) => goDetail(a.id, true)}
        onDelete={(a) => setDeleting(a)}
      />

      <RecordFormModal open={formOpen} onClose={() => setFormOpen(false)}
        title="New application" fields={fields} onSubmit={submit} submitLabel="Create application" />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) setData((d) => d.filter((x) => x.id !== deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting?.applicant} />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
