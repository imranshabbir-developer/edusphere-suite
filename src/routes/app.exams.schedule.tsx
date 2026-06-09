import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { exams, type Exam } from "@/mockData";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/app/exams/schedule")({ component: ExamSchedule });

function ExamSchedule() {
  const upcoming = exams.filter((e) => e.status !== "Completed");
  const columns: ColumnDef<Exam>[] = [
    { header: "Exam", accessorKey: "title" },
    { header: "Program", accessorKey: "program" },
    { header: "Type", accessorKey: "type", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Date", accessorKey: "date", cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString() },
    { header: "Duration", accessorKey: "duration", cell: ({ getValue }) => `${getValue()} min` },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exam Schedule</h1>
        <p className="text-muted-foreground text-sm">All scheduled, live and completed exams.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Upcoming" value={exams.filter(e => e.status === "Scheduled").length} icon="CalendarIcon" tone="primary" />
        <StatsCard title="Live" value={exams.filter(e => e.status === "Live").length} icon="SignalIcon" tone="warning" />
        <StatsCard title="Completed" value={exams.filter(e => e.status === "Completed").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="Total" value={exams.length} icon="DocumentTextIcon" tone="accent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {upcoming.slice(0, 6).map((e) => (
          <div key={e.id} className="glass-card rounded-2xl p-4">
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
          </div>
        ))}
      </div>
      <DataTable data={exams} columns={columns} searchPlaceholder="Search exams…" />
    </div>
  );
}
