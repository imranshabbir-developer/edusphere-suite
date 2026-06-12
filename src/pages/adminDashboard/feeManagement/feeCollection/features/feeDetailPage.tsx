import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { fees as seed, type FeeRecord } from "@/mockData";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const STATUSES: FeeRecord["status"][] = ["Paid", "Partial", "Overdue"];

const fields: FieldDef[] = [
  { key: "student", label: "Student name", required: true, span: 2 },
  { key: "program", label: "Program", type: "select", options: PROGRAMS },
  { key: "invoice", label: "Invoice #" },
  { key: "amount", label: "Total amount", type: "number" },
  { key: "paid", label: "Paid", type: "number" },
  { key: "dueDate", label: "Due date", type: "date" },
  { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
];

export default function FeeDetailPage() {
  const { role, id } = useParams({ from: "/$role/fees/collection/$id" });
  const { edit } = useSearch({ from: "/$role/fees/collection/$id" });
  const storageKey = `${role}/fees/collection`;
  const [data, setData] = usePersistedRecords<FeeRecord>(storageKey, seed);
  const record = data.find((f) => f.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/fees/collection`}
        moduleLabel="Fee Collection"
        recordId={id}
      />
    );
  }

  return (
    <RecordDetailPage
      variant="fee"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/fees/collection`}
      moduleLabel="Fee Collection"
      recordTitle={record.invoice}
      initialEdit={edit}
      onSave={(vals) => {
        const amount = Number(vals.amount ?? record.amount);
        const paid = Number(vals.paid ?? record.paid);
        const status: FeeRecord["status"] =
          paid >= amount && amount > 0 ? "Paid" : paid > 0 ? "Partial" : "Overdue";
        setData((d) =>
          d.map((f) =>
            f.id === id
              ? { ...f, ...vals, amount, paid, due: amount - paid, status: (vals.status as FeeRecord["status"]) ?? status } as FeeRecord
              : f,
          ),
        );
      }}
      onDelete={() => setData((d) => d.filter((f) => f.id !== id))}
    />
  );
}
