import { useMemo, type Dispatch, type SetStateAction } from "react";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import type { ModuleConfig, ModuleRow } from "@/config/moduleTypes";

export function GenericRecordDetail({
  role,
  modulePath,
  recordId,
  label,
  initialEdit = false,
  rows,
  setRows,
  config,
}: {
  role: string;
  modulePath: string;
  recordId: string;
  label: string;
  initialEdit?: boolean;
  rows: ModuleRow[];
  setRows: Dispatch<SetStateAction<ModuleRow[]>>;
  config: ModuleConfig;
}) {
  const record = rows.find((r) => r.id === recordId);
  const listPath = `/${role}/${modulePath}`;
  const labelCap = useMemo(
    () => label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    [label],
  );

  if (!record) {
    return <RecordNotFound listPath={listPath} moduleLabel={labelCap} recordId={recordId} />;
  }

  const recordTitle = String(record[config.titleField] ?? record.name ?? recordId);

  return (
    <RecordDetailPage
      variant="generic"
      record={record}
      fields={config.fields}
      listPath={listPath}
      moduleLabel={labelCap}
      recordTitle={recordTitle}
      initialEdit={initialEdit}
      onSave={(vals) =>
        setRows((r) => r.map((x) => (x.id === recordId ? { ...x, ...vals } : x)))
      }
      onDelete={() => setRows((r) => r.filter((x) => x.id !== recordId))}
    />
  );
}
