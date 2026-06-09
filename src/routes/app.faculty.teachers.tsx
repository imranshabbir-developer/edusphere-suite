import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { teachers, type Teacher } from "@/mockData";
import { StarIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/app/faculty/teachers")({ component: TeachersPage });

function TeachersPage() {
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
    { header: "Subjects", accessorKey: "subjects", cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">{row.original.subjects.map((s) => <Badge key={s} tone="accent">{s}</Badge>)}</div>
    ) },
    { header: "Experience", accessorKey: "experience", cell: ({ getValue }) => `${getValue()} yrs` },
    { header: "Rating", accessorKey: "rating", cell: ({ getValue }) => (
      <span className="inline-flex items-center gap-1 font-semibold"><StarIcon className="w-4 h-4 fill-warning text-warning" />{String(getValue())}</span>
    ) },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Teachers</h1><p className="text-muted-foreground text-sm">Faculty directory and performance.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total" value={teachers.length} icon="IdentificationIcon" tone="primary" />
        <StatsCard title="Active" value={teachers.filter(t => t.status === "Active").length} icon="CheckBadgeIcon" tone="success" />
        <StatsCard title="Avg Rating" value={(teachers.reduce((a, t) => a + t.rating, 0) / teachers.length).toFixed(1)} icon="StarIcon" tone="warning" />
        <StatsCard title="Avg Experience" value={`${(teachers.reduce((a, t) => a + t.experience, 0) / teachers.length).toFixed(1)} yrs`} icon="ClockIcon" tone="accent" />
      </div>
      <DataTable data={teachers} columns={columns} searchPlaceholder="Search teachers…" />
    </div>
  );
}
