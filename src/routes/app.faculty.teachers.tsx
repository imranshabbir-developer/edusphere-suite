import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecordFormModal, RecordDetailModal, ConfirmDialog, type FieldDef } from "@/components/ui/RecordDialogs";
import { teachers as seed, type Teacher } from "@/mockData";
import { StarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const Route = createFileRoute("/app/faculty/teachers")({ component: TeachersPage });

const DEPTS = ["Computer Science", "Mathematics", "Physics", "Business", "Humanities", "Engineering"];
const STATUSES: Teacher["status"][] = ["Active", "On Leave"];
const av = (n: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(n || "New")}`;

function TeachersPage() {
  const [data, setData] = useState<Teacher[]>(seed);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [viewing, setViewing] = useState<Teacher | null>(null);
  const [deleting, setDeleting] = useState<Teacher | null>(null);

  const fields: FieldDef[] = [
    { key: "name", label: "Full name", required: true, span: 2 },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "department", label: "Department", type: "select", options: DEPTS },
    { key: "experience", label: "Experience (yrs)", type: "number" },
    { key: "rating", label: "Rating", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
  ];

  const submit = (v: Record<string, unknown>) => {
    if (editing) setData((d) => d.map((t) => t.id === editing.id ? { ...t, ...v, subjects: editing.subjects } as Teacher : t));
    else {
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
    }
    setEditing(null);
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
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
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
        onRowClick={(t) => setViewing(t)}
        onView={(t) => setViewing(t)}
        onEdit={(t) => { setEditing(t); setFormOpen(true); }}
        onDelete={(t) => setDeleting(t)}
      />

      <RecordFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit teacher" : "Add new teacher"} fields={fields} initial={editing ?? undefined}
        onSubmit={submit} submitLabel={editing ? "Save changes" : "Add teacher"} />
      <RecordDetailModal open={!!viewing} onClose={() => setViewing(null)}
        title={viewing?.name ?? "Teacher"} record={viewing as unknown as Record<string, unknown>} exclude={["avatar", "subjects"]} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setData((d) => d.filter((x) => x.id !== deleting.id))}
        message={`Delete "${deleting?.name}"? This cannot be undone.`} />
    </div>
  );
}
