import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { students, type Student } from "@/mockData";

export const Route = createFileRoute("/app/students/list")({ component: StudentsPage });

function StudentsPage() {
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground text-sm">Complete student information system.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={students.length} icon="UserGroupIcon" tone="primary" delta={6} />
        <StatsCard title="Active" value={students.filter(s => s.status === "Active").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="On Leave" value={students.filter(s => s.status === "On Leave").length} icon="ClockIcon" tone="warning" />
        <StatsCard title="Avg CGPA" value={(students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2)} icon="AcademicCapIcon" tone="accent" />
      </div>
      <DataTable data={students} columns={columns} searchPlaceholder="Search by name, program, roll no…" />
    </div>
  );
}
