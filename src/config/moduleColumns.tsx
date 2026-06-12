import type { ColumnDef } from "@tanstack/react-table";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import type { ColumnMeta, ModuleRow } from "./moduleTypes";

export function buildColumns(meta: ColumnMeta[]): ColumnDef<ModuleRow, unknown>[] {
  return meta.map((col) => ({
    header: col.header,
    accessorKey: col.accessorKey,
    cell: ({ getValue }) => {
      const v = getValue();
      if (v == null || v === "") return <span className="text-muted-foreground">—</span>;
      switch (col.type) {
        case "mono":
          return <span className="font-mono text-xs">{String(v)}</span>;
        case "badge":
          return <Badge tone="accent">{String(v)}</Badge>;
        case "status":
          return <Badge tone={statusTone(String(v))}>{String(v)}</Badge>;
        case "currency":
          return `$${Number(v).toLocaleString()}`;
        case "percent":
          return `${v}%`;
        case "date":
          return String(v);
        default:
          return String(v);
      }
    },
  }));
}
