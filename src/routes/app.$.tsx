import { createFileRoute, useParams } from "@tanstack/react-router";
import { useAppSelector } from "@/redux/store";
import { SIDEBAR } from "@/constants/sidebar";
import { StatsCard } from "@/components/ui/StatsCard";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusIcon, ArrowDownTrayIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

export const Route = createFileRoute("/app/$")({ component: GenericModule });

interface Row {
  id: string; name: string; reference: string; owner: string;
  category: string; status: string; updated: string; value: number;
}

function seedRows(seed: string): Row[] {
  const cats = ["General", "Tier 1", "Tier 2", "Priority", "Standard"];
  const stat = ["Active", "Pending", "Completed", "Draft", "Archived"];
  const owners = ["Alex Morgan", "Priya Sharma", "Daniel Reyes", "Jane Doe", "Mark Lee"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: 24 }).map((_, i) => {
    const v = (h + i * 7) % 1000;
    return {
      id: `${seed.slice(0, 3).toUpperCase()}-${1000 + i}`,
      name: `${seed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Record ${i + 1}`,
      reference: `REF-${v}${i}`,
      owner: owners[(h + i) % owners.length],
      category: cats[(h + i * 3) % cats.length],
      status: stat[(h + i * 5) % stat.length],
      updated: new Date(Date.now() - i * 86400000).toLocaleDateString(),
      value: 1000 + ((h + i * 137) % 9000),
    };
  });
}

function GenericModule() {
  const params = useParams({ from: "/app/$" });
  const splat = (params as { _splat?: string })._splat ?? "";
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";

  const path = `/app/${splat}`;
  const { groupLabel, label } = useMemo(() => {
    for (const g of SIDEBAR[role]) {
      const found = g.items.find((i) => i.to === path);
      if (found) return { groupLabel: g.label, label: found.label };
    }
    const seg = splat.split("/").filter(Boolean);
    return { groupLabel: seg[0]?.replace(/-/g, " ") ?? "Module", label: seg[seg.length - 1]?.replace(/-/g, " ") ?? "Page" };
  }, [path, role, splat]);

  const rows = useMemo(() => seedRows(splat || "module"), [splat]);

  const columns: ColumnDef<Row>[] = [
    { header: "ID", accessorKey: "id", cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
    { header: "Name", accessorKey: "name" },
    { header: "Reference", accessorKey: "reference" },
    { header: "Category", accessorKey: "category", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Owner", accessorKey: "owner" },
    { header: "Status", accessorKey: "status", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
    { header: "Updated", accessorKey: "updated" },
    { header: "Value", accessorKey: "value", cell: ({ getValue }) => `$${Number(getValue()).toLocaleString()}` },
  ];

  const totals = useMemo(() => {
    const active = rows.filter((r) => r.status === "Active").length;
    const pending = rows.filter((r) => r.status === "Pending").length;
    const val = rows.reduce((a, b) => a + b.value, 0);
    return { active, pending, val };
  }, [rows]);

  const cap = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{cap(groupLabel)}</p>
          <h1 className="text-2xl font-bold tracking-tight">{cap(label)}</h1>
          <p className="text-muted-foreground text-sm">Manage {cap(label).toLowerCase()} across your organization.</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">
            <FunnelIcon className="w-4 h-4" /> Filter
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
            <PlusIcon className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Records" value={rows.length} icon="Squares2X2Icon" tone="primary" delta={4} />
        <StatsCard title="Active" value={totals.active} icon="CheckBadgeIcon" tone="success" delta={2} />
        <StatsCard title="Pending" value={totals.pending} icon="ClockIcon" tone="warning" />
        <StatsCard title="Total Value" value={`$${(totals.val / 1000).toFixed(1)}K`} icon="BanknotesIcon" tone="accent" delta={7} />
      </div>

      <DataTable data={rows} columns={columns} searchPlaceholder={`Search ${cap(label).toLowerCase()}…`} />
    </div>
  );
}
