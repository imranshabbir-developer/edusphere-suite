import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecordFormModal, RecordDetailModal, ConfirmDialog, type FieldDef } from "@/components/ui/RecordDialogs";
import { students as seed, type Student } from "@/mockData";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const Route = createFileRoute("/app/students/list")({ component: StudentsPage });

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const SECTIONS = ["A", "B", "C"];
const STATUSES: Student["status"][] = ["Active", "On Leave", "Graduated"];

const av = (n: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n || "New")}`;

function StudentsPage() {
  const [data, setData] = useState<Student[]>(seed);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);

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
    if (editing) setData((d) => d.map((s) => s.id === editing.id ? { ...s, ...v } as Student : s));
    else {
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
    }
    setEditing(null);
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
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
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
        onRowClick={(s) => setViewing(s)}
        onView={(s) => setViewing(s)}
        onEdit={(s) => { setEditing(s); setFormOpen(true); }}
        onDelete={(s) => setDeleting(s)}
      />

      <RecordFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit student" : "Add new student"} fields={fields} initial={editing ?? undefined}
        onSubmit={submit} submitLabel={editing ? "Save changes" : "Add student"} />
      <RecordDetailModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name ?? "Student"} record={viewing as unknown as Record<string, unknown>} exclude={["avatar"]} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setData((d) => d.filter((x) => x.id !== deleting.id))}
        message={`Delete "${deleting?.name}"? This cannot be undone.`} />
    </div>
  );
}
