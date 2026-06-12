import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useAppSelector } from "@/store/store";
import { SIDEBAR } from "@/global/AppLayout/sidebarConfig";
import { StatsCard } from "@/components/ui/StatsCard";
import { DataTable } from "@/components/ui/DataTable";
import { RecordFormModal } from "@/components/ui/RecordDialogs";
import { ConfirmDeleteModal } from "@/components/records/ConfirmDeleteModal";
import { ActionFeedbackModal, type FeedbackAction } from "@/components/records/ActionFeedbackModal";
import { GenericRecordDetail } from "./genericRecordDetail";
import { parseSplatWithId } from "@/utils/recordStorage";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { getModuleConfig } from "@/config/moduleRegistry";
import { buildColumns } from "@/config/moduleColumns";
import type { ModuleRow } from "@/config/moduleTypes";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

export default function GenericModule() {
  const params = useParams({ from: "/$role/$" });
  const search = useSearch({ strict: false }) as { edit?: string };
  const splat = (params as { _splat?: string })._splat ?? "";
  const urlRole = (params as { role?: string }).role ?? "admin";
  const role = useAppSelector((s) => s.auth.user?.role) ?? "admin";
  const navigate = useNavigate();

  const { modulePath, recordId } = parseSplatWithId(splat);
  const path = `/${urlRole}/${modulePath || splat}`;

  const storageKey = `${urlRole}/${modulePath || splat || "module"}`;
  const seedKey = modulePath || splat || "module";

  const { groupLabel, label } = useMemo(() => {
    for (const g of SIDEBAR[role]) {
      const found = g.items.find((i) => i.to === path);
      if (found) return { groupLabel: g.label, label: found.label };
    }
    const seg = (modulePath || splat).split("/").filter(Boolean);
    return { groupLabel: seg[0]?.replace(/-/g, " ") ?? "Module", label: seg[seg.length - 1]?.replace(/-/g, " ") ?? "Page" };
  }, [path, role, modulePath, splat]);

  const config = useMemo(() => getModuleConfig(seedKey, label, urlRole), [seedKey, label, urlRole]);
  const seedRows = useMemo(() => config.seed(seedKey, label), [config, seedKey, label]);
  const [rows, setRows] = usePersistedRecords<ModuleRow>(storageKey, seedRows);

  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ModuleRow | null>(null);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const columns = useMemo(() => buildColumns(config.columns), [config.columns]);
  const moduleSegment = modulePath || splat || "module";
  const cap = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const labelCap = cap(label);
  const singular = labelCap.replace(/s$/, "").toLowerCase();

  const goDetail = (id: string, edit = false) => {
    navigate({
      to: "/$role/$",
      params: { role: urlRole, _splat: `${modulePath || splat}/${id}` },
      search: edit ? { edit: "1" } : {},
    });
  };

  const submit = (vals: Record<string, unknown>) => {
    setRows((r) => [config.buildRow(vals, config.idPrefix), ...r]);
    setFormOpen(false);
    setFeedback("created");
    setFeedbackOpen(true);
  };

  const recordTitle = (row: ModuleRow) => String(row[config.titleField] ?? row.name ?? row.id);

  if (recordId) {
    return (
      <GenericRecordDetail
        role={urlRole}
        modulePath={moduleSegment}
        recordId={recordId}
        label={label}
        initialEdit={search.edit === "1"}
        rows={rows}
        setRows={setRows}
        config={config}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{cap(groupLabel)}</p>
          <h1 className="text-2xl font-bold tracking-tight">{labelCap}</h1>
          <p className="text-muted-foreground text-sm">Manage {labelCap.toLowerCase()} across your organization.</p>
        </div>
        <button onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
          <PlusIcon className="w-4 h-4" /> New {labelCap.replace(/s$/, "")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {config.stats.map((s) => (
          <StatsCard
            key={s.title}
            title={s.title}
            value={s.getValue(rows)}
            icon={s.icon}
            tone={s.tone}
            delta={s.delta}
          />
        ))}
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchPlaceholder={`Search ${labelCap.toLowerCase()}…`}
        exportFilename={(modulePath || splat).replace(/\//g, "-") || "records"}
        filters={config.filters}
        onRowClick={(r) => goDetail(r.id)}
        onView={(r) => goDetail(r.id)}
        onEdit={(r) => goDetail(r.id, true)}
        onDelete={(r) => setDeleting(r)}
      />

      <RecordFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`Create new ${singular}`}
        fields={config.fields}
        onSubmit={submit}
        submitLabel="Create"
      />
      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) setRows((r) => r.filter((x) => x.id !== deleting.id));
          setFeedback("deleted");
          setFeedbackOpen(true);
        }}
        recordName={deleting ? recordTitle(deleting) : undefined}
      />
      <ActionFeedbackModal action={feedback} open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
