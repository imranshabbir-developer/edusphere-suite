import type { FieldDef } from "@/components/ui/RecordDialogs";
import type { FilterMeta, ModuleConfig, ModuleRow, StatMeta } from "./moduleTypes";
import {
  ACTIVE_STATUSES, ALL_PROGRAMS, CRM_STATUSES, DEPARTMENTS, STAFF_NAMES,
  fullName, hashStr, makeId, pick, dateOffset,
} from "./moduleConstants";

export function defaultStats(statusKey = "status"): StatMeta[] {
  const count = (rows: Record<string, unknown>[], match: (x: Record<string, unknown>) => boolean) =>
    Array.isArray(rows) ? rows.filter(match).length : 0;

  return [
    { title: "Total Records", icon: "Squares2X2Icon", tone: "primary", getValue: (r) => (Array.isArray(r) ? r.length : 0), delta: 4 },
    { title: "Active", icon: "CheckBadgeIcon", tone: "success", getValue: (r) => count(r, (x) => x[statusKey] === "Active") },
    { title: "Pending", icon: "ClockIcon", tone: "warning", getValue: (r) => count(r, (x) => x[statusKey] === "Pending" || x[statusKey] === "New") },
    { title: "This Month", icon: "CalendarDaysIcon", tone: "accent", getValue: (r) => Math.min(Array.isArray(r) ? r.length : 0, 12) },
  ];
}

export function financeStats(): StatMeta[] {
  const rows = (r: Record<string, unknown>[]) => (Array.isArray(r) ? r : []);
  return [
    { title: "Total Records", icon: "Squares2X2Icon", tone: "primary", getValue: (r) => rows(r).length },
    { title: "Total Amount", icon: "BanknotesIcon", tone: "accent", getValue: (r) => `$${(rows(r).reduce((a, x) => a + Number(x.amount ?? 0), 0) / 1000).toFixed(1)}K` },
    { title: "Paid", icon: "CheckBadgeIcon", tone: "success", getValue: (r) => rows(r).filter((x) => x.status === "Paid").length },
    { title: "Overdue", icon: "ExclamationTriangleIcon", tone: "warning", getValue: (r) => rows(r).filter((x) => x.status === "Overdue").length },
  ];
}

export function buildFromFields(
  idPrefix: string,
  fields: FieldDef[],
  columns: ModuleConfig["columns"],
  filters: FilterMeta[],
  stats: StatMeta[],
  seedFn: (path: string, label: string) => ModuleRow[],
): ModuleConfig {
  const titleField = fields.find((f) => f.required)?.key ?? fields[0]?.key ?? "name";
  return {
    idPrefix,
    titleField,
    fields,
    columns,
    filters,
    stats,
    seed: seedFn,
    buildRow: (vals, prefix) => {
      const row: ModuleRow = { id: `${prefix}-${Date.now().toString().slice(-5)}` };
      fields.forEach((f) => {
        const v = vals[f.key];
        if (v !== undefined && v !== "") row[f.key] = f.type === "number" ? Number(v) : v;
        else if (f.type === "select" && f.options?.length) row[f.key] = f.options[0];
        else if (f.type === "date") row[f.key] = dateOffset(0);
        else row[f.key] = "";
      });
      if (!row[titleField]) row[titleField] = "Untitled";
      return row;
    },
  };
}

export function seedCount(path: string, n = 22): number {
  return n;
}

export { fullName, hashStr, makeId, pick, dateOffset, STAFF_NAMES, ALL_PROGRAMS, DEPARTMENTS, CRM_STATUSES, ACTIVE_STATUSES };
