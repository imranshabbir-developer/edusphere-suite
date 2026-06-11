import { useMemo, type Dispatch, type SetStateAction } from "react";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import type { FieldDef } from "@/components/ui/RecordDialogs";

interface Row {
  id: string;
  name: string;
  reference: string;
  owner: string;
  category: string;
  status: string;
  updated: string;
  value: number;
  [k: string]: unknown;
}

const CATS = ["General", "Tier 1", "Tier 2", "Priority", "Standard"];
const STATUSES = ["Active", "Pending", "Completed", "Draft", "Archived"];
const OWNERS = ["Alex Morgan", "Priya Sharma", "Daniel Reyes", "Jane Doe", "Mark Lee"];

const fields: FieldDef[] = [
  { key: "name", label: "Name", required: true, span: 2 },
  { key: "reference", label: "Reference" },
  { key: "owner", label: "Owner", type: "select", options: OWNERS },
  { key: "category", label: "Category", type: "select", options: CATS },
  { key: "status", label: "Status", type: "select", options: STATUSES },
  { key: "value", label: "Value", type: "number" },
  { key: "updated", label: "Date", type: "date" },
];

export function GenericRecordDetail({
  role,
  modulePath,
  recordId,
  label,
  initialEdit = false,
  rows,
  setRows,
}: {
  role: string;
  modulePath: string;
  recordId: string;
  label: string;
  initialEdit?: boolean;
  rows: Row[];
  setRows: Dispatch<SetStateAction<Row[]>>;
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

  return (
    <RecordDetailPage
      variant="generic"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={listPath}
      moduleLabel={labelCap}
      recordTitle={record.name}
      initialEdit={initialEdit}
      onSave={(vals) =>
        setRows((r) => r.map((x) => (x.id === recordId ? { ...x, ...vals } as Row : x)))
      }
      onDelete={() => setRows((r) => r.filter((x) => x.id !== recordId))}
    />
  );
}
