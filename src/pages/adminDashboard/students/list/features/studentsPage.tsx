
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
import { students as seed, type Student } from "@/mockData";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const SECTIONS = ["A", "B", "C"];
const STATUSES: Student["status"][] = ["Active", "On Leave", "Graduated"];

const av = (n: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n || "New")}`;

export default function StudentsPage() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();
  const storageKey = `${role}/students/list`;
  const [data, setData] = usePersistedRecords<Student>(storageKey, seed);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/students/list/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const fields: FieldDef[] = [
    { key: "name", label: "Full name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "rollNo", label: "Roll number" },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "batch", label: "Batch" },
    { key: "section", label: "Section", type: "select", options: SECTIONS },
    { key: "cgpa", label: "CGPA", type: "number" },
    { key: "attendance", label: "Attendance %", type: "number" },
    { key: "guardian", label: "Guardian" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    const name = String(v.name ?? "New Student");
    setData((d) => [{
      id: `STU-${Date.now().toString().slice(-5)}`,
      name, email: String(v.email ?? ""), phone: String(v.phone ?? ""),
      rollNo: String(v.rollNo ?? `2024${Math.floor(Math.random() * 9999)}`),
      program: String(v.program ?? PROGRAMS[0]),
      batch: String(v.batch ?? "2024-2028"),
      section: String(v.section ?? "A"),
      cgpa: Number(v.cgpa ?? 3.5),
      attendance: Number(v.attendance ?? 90),
      guardian: String(v.guardian ?? ""),
      status: (v.status as Student["status"]) ?? "Active",
      avatar: av(name),
    }, ...d]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
  };

  const columns: ColumnDef<Student>[] = [
    {
      header: "Student", accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img src={row.original.avatar} className="w-9 h-9 rounded-full" alt="" />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.rollNo} · {row.original.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Program", accessorKey: "program" },
    { header: "Batch", accessorKey: "batch" },
    { header: "Section", accessorKey: "section" },
    { header: "CGPA", accessorKey: "cgpa", cell: ({ getValue }) => <span className="font-semibold">{String(getValue())}</span> },
    {
      header: "Attendance", accessorKey: "attendance",
      cell: ({ getValue }) => {
        const v = Number(getValue());
        const tone = v >= 85 ? "bg-success" : v >= 70 ? "bg-warning" : "bg-danger";
        return (
          <div className="flex items-center gap-2 w-32">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${tone}`} style={{ width: `${v}%` }} />
            </div>
            <span className="text-xs w-8 text-right">{v}%</span>
          </div>
        );
      },
    },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground text-sm">Complete student information system.</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New Student
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={data.length} icon="UserGroupIcon" tone="primary" delta={6} />
        <StatsCard title="Active" value={data.filter(s => s.status === "Active").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="On Leave" value={data.filter(s => s.status === "On Leave").length} icon="ClockIcon" tone="warning" />
        <StatsCard title="Avg CGPA" value={(data.reduce((a, s) => a + s.cgpa, 0) / Math.max(data.length, 1)).toFixed(2)} icon="AcademicCapIcon" tone="accent" />
      </div>
      <DataTable
        data={data} columns={columns}
        searchPlaceholder="Search by name, program, roll no…"
        exportFilename="students"
        filters={[
          { id: "program", label: "Program", options: PROGRAMS },
          { id: "section", label: "Section", options: SECTIONS },
          { id: "status", label: "Status", options: STATUSES as unknown as string[] },
        ]}
        onRowClick={(s) => goDetail(s.id)}
        onView={(s) => goDetail(s.id)}
        onEdit={(s) => goDetail(s.id, true)}
        onDelete={(s) => setDeleting(s)}
      />

      <RecordFormModal open={formOpen} onClose={() => setFormOpen(false)}
        title="Add new student" fields={fields} onSubmit={submit} submitLabel="Add student" />
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
