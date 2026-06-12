
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
import { teachers as seed, type Teacher } from "@/mockData";
import { StarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



const DEPTS = ["Computer Science", "Mathematics", "Physics", "Business", "Humanities", "Engineering"];
const STATUSES: Teacher["status"][] = ["Active", "On Leave"];
const av = (n: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n || "New")}`;

export default function TeachersPage() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();
  const storageKey = `${role}/faculty/teachers`;
  const [data, setData] = usePersistedRecords<Teacher>(storageKey, seed);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Teacher | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/faculty/teachers/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const fields: FieldDef[] = [
    { key: "name", label: "Full name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "department", label: "Department", type: "select", options: DEPTS },
    { key: "experience", label: "Experience (yrs)", type: "number" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    const name = String(v.name ?? "New Teacher");
    setData((d) => [{
      id: `TCH-${Date.now().toString().slice(-5)}`,
      name, email: String(v.email ?? ""),
      department: String(v.department ?? DEPTS[0]),
      subjects: ["General"],
      experience: Number(v.experience ?? 1),
      rating: Number(v.rating ?? 4),
      status: (v.status as Teacher["status"]) ?? "Active",
      avatar: av(name),
    }, ...d]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
  };

  const columns: ColumnDef<Teacher>[] = [
    {
      header: "Teacher", accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img src={row.original.avatar} className="w-9 h-9 rounded-full" alt="" />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Department", accessorKey: "department" },
    {
      header: "Subjects", accessorKey: "subjects",
      cell: ({ row }) => <div className="flex flex-wrap gap-1">{row.original.subjects.map((s) => <Badge key={s} tone="accent">{s}</Badge>)}</div>,
    },
    { header: "Experience", accessorKey: "experience", cell: ({ getValue }) => `${getValue()} yrs` },
    {
      header: "Rating", accessorKey: "rating",
      cell: ({ getValue }) => <span className="inline-flex items-center gap-1 font-semibold"><StarIcon className="w-4 h-4 fill-warning text-warning" />{String(getValue())}</span>,
    },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground text-sm">Faculty directory and performance.</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New Teacher
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total" value={data.length} icon="IdentificationIcon" tone="primary" />
        <StatsCard title="Active" value={data.filter(t => t.status === "Active").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="Avg Rating" value={(data.reduce((a, t) => a + t.rating, 0) / Math.max(data.length, 1)).toFixed(1)} icon="StarIcon" tone="warning" />
        <StatsCard title="Avg Experience" value={`${(data.reduce((a, t) => a + t.experience, 0) / Math.max(data.length, 1)).toFixed(1)} yrs`} icon="ClockIcon" tone="accent" />
      </div>
      <DataTable
        data={data} columns={columns} searchPlaceholder="Search teachers…"
        exportFilename="teachers"
        filters={[
          { id: "department", label: "Department", options: DEPTS },
          { id: "status", label: "Status", options: STATUSES as unknown as string[] },
        ]}
        onRowClick={(t) => goDetail(t.id)}
        onView={(t) => goDetail(t.id)}
        onEdit={(t) => goDetail(t.id, true)}
        onDelete={(t) => setDeleting(t)}
      />

      <RecordFormModal open={formOpen} onClose={() => setFormOpen(false)}
        title="Add new teacher" fields={fields} onSubmit={submit} submitLabel="Add teacher" />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) setData((d) => d.filter((x) => x.id !== deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting?.name} />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
