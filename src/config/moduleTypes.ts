import type { FieldDef } from "@/components/ui/RecordDialogs";

export type ColumnType = "text" | "mono" | "badge" | "status" | "currency" | "percent" | "date";

export interface ColumnMeta {
  header: string;
  accessorKey: string;
  type?: ColumnType;
}

export interface StatMeta {
  title: string;
  icon: string;
  tone: "primary" | "success" | "warning" | "accent" | "danger";
  getValue: (rows: Record<string, unknown>[]) => string | number;
  delta?: number;
}

export interface FilterMeta {
  id: string;
  label: string;
  options: string[];
}

export type ModuleRow = Record<string, unknown> & { id: string };

export interface ModuleConfig {
  idPrefix: string;
  titleField: string;
  fields: FieldDef[];
  columns: ColumnMeta[];
  filters: FilterMeta[];
  stats: StatMeta[];
  seed: (modulePath: string, label: string) => ModuleRow[];
  buildRow: (vals: Record<string, unknown>, idPrefix: string) => ModuleRow;
}
