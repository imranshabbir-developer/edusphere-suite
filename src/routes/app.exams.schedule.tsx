import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecordFormModal, RecordDetailModal, ConfirmDialog, type FieldDef } from "@/components/ui/RecordDialogs";
import { exams as seed, type Exam } from "@/mockData";
import { CalendarIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const Route = createFileRoute("/app/exams/schedule")({ component: ExamSchedule });

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const TYPES: Exam["type"][] = ["Mid-term", "Final", "Quiz", "Practical"];
const STATUSES: Exam["status"][] = ["Scheduled", "Live", "Completed"];

function ExamSchedule() {
  const [data, setData] = useState<Exam[]>(seed);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [viewing, setViewing] = useState<Exam | null>(null);
  const [deleting, setDeleting] = useState<Exam | null>(null);

  const fields: FieldDef[] = [
    { key: "title", label: "Exam title", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "type", label: "Type", type: "select", options: TYPES as unknown as string[] },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "duration", label: "Duration (min)", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[], span: 2 },
  ];

  const submit = (v: Record<string, unknown>) => {
    if (editing) setData((d) => d.map((e) => e.id === editing.id ? { ...e, ...v } as Exam : e));
    else setData((d) => [{
      id: `EXM-${Date.now().toString().slice(-5)}`,
      title: String(v.title ?? "New Exam"),
      program: String(v.program ?? PROGRAMS[0]),
      type: (v.type as Exam["type"]) ?? "Quiz",
      date: v.date ? new Date(String(v.date)).toISOString() : new Date().toISOString(),
      duration: Number(v.duration ?? 60),
      status: (v.status as Exam["status"]) ?? "Scheduled",
    }, ...d]);
    setEditing(null);
  };

  const columns: ColumnDef<Exam>[] = [
    { header: "Exam", accessorKey: "title" },
    { header: "Program", accessorKey: "program" },
    { header: "Type", accessorKey: "type", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Date", accessorKey: "date", cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString() },
    { header: "Duration", accessorKey: "duration", cell: ({ getValue }) => `${getValue()} min` },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  const upcoming = data.filter((e) => e.status !== "Completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Schedule</h1>
          <p className="text-muted-foreground text-sm">All scheduled, live and completed exams.</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true); }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New Exam
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Upcoming" value={data.filter(e => e.status === "Scheduled").length} icon="CalendarIcon" tone="primary" />
        <StatsCard title="Live" value={data.filter(e => e.status === "Live").length} icon="SignalIcon" tone="warning" />
        <StatsCard title="Completed" value={data.filter(e => e.status === "Completed").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="Total" value={data.length} icon="DocumentTextIcon" tone="accent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {upcoming.slice(0, 6).map((e) => (
          <button key={e.id} onClick={() => setViewing(e)} className="text-left glass-card rounded-2xl p-4 hover:shadow-elegant transition">
            <div className="flex items-start justify-between">
              <div>
                <Badge tone="accent">{e.type}</Badge>
                <p className="font-semibold mt-2">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.program}</p>
              </div>
              <Badge tone={statusTone(e.status)}>{e.status}</Badge>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {new Date(e.date).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" /> {e.duration} min</span>
            </div>
          </button>
        ))}
      </div>
      <DataTable
        data={data} columns={columns} searchPlaceholder="Search exams…"
        exportFilename="exams"
        filters={[
          { id: "program", label: "Program", options: PROGRAMS },
          { id: "type", label: "Type", options: TYPES as unknown as string[] },
          { id: "status", label: "Status", options: STATUSES as unknown as string[] },
        ]}
        onRowClick={(e) => setViewing(e)}
        onView={(e) => setViewing(e)}
        onEdit={(e) => { setEditing(e); setFormOpen(true); }}
        onDelete={(e) => setDeleting(e)}
      />

      <RecordFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }}
        title={editing ? "Edit exam" : "Schedule new exam"} fields={fields} initial={editing ?? undefined}
        onSubmit={submit} submitLabel={editing ? "Save changes" : "Create exam"} />
      <RecordDetailModal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.title ?? "Exam"} record={viewing as unknown as Record<string, unknown>} />
      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && setData((d) => d.filter((x) => x.id !== deleting.id))}
        message={`Delete "${deleting?.title}"?`} />
    </div>
  );
}
