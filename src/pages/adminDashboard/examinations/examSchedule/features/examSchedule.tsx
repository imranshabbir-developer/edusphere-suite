
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
import { exams as seed, type Exam } from "@/mockData";
import { CalendarIcon, ClockIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";



const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const TYPES: Exam["type"][] = ["Mid-term", "Final", "Quiz", "Practical"];
const STATUSES: Exam["status"][] = ["Scheduled", "Live", "Completed"];

export default function ExamSchedule() {
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();
  const storageKey = `${role}/exams/schedule`;
  const [data, setData] = usePersistedRecords<Exam>(storageKey, seed);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Exam | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/exams/schedule/$id",
      params: { role, id },
      search: edit ? { edit: "1" } : {},
    });
  };

  const fields: FieldDef[] = [
    { key: "title", label: "Exam title", required: true, span: 2 },
    { key: "program", label: "Program", type: "select", options: PROGRAMS },
    { key: "type", label: "Type", type: "select", options: TYPES as unknown as string[] },
    { key: "date", label: "Date", type: "date", required: true },
    { key: "duration", label: "Duration (min)", type: "number" },
    { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[], span: 2 },
  ];

  const submit = (v: Record<string, unknown>) => {
    setData((d) => [{
      id: `EXM-${Date.now().toString().slice(-5)}`,
      title: String(v.title ?? "New Exam"),
      program: String(v.program ?? PROGRAMS[0]),
      type: (v.type as Exam["type"]) ?? "Quiz",
      date: v.date ? new Date(String(v.date)).toISOString() : new Date().toISOString(),
      duration: Number(v.duration ?? 60),
      status: (v.status as Exam["status"]) ?? "Scheduled",
    }, ...d]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
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
        <button onClick={() => setFormOpen(true)}
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
          <button key={e.id} onClick={() => goDetail(e.id)} className="text-left glass-card rounded-2xl p-4 hover:shadow-elegant transition">
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
        onRowClick={(e) => goDetail(e.id)}
        onView={(e) => goDetail(e.id)}
        onEdit={(e) => goDetail(e.id, true)}
        onDelete={(e) => setDeleting(e)}
      />

      <RecordFormModal open={formOpen} onClose={() => setFormOpen(false)}
        title="Schedule new exam" fields={fields} onSubmit={submit} submitLabel="Create exam" />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) setData((d) => d.filter((x) => x.id !== deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting?.title} />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
