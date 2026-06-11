import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { teachers as seed, type Teacher } from "@/mockData";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const DEPTS = ["Computer Science", "Mathematics", "Physics", "Business", "Humanities", "Engineering"];
const STATUSES: Teacher["status"][] = ["Active", "On Leave"];

const fields: FieldDef[] = [
  { key: "name", label: "Full name", required: true, span: 2 },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "department", label: "Department", type: "select", options: DEPTS },
  { key: "experience", label: "Experience (yrs)", type: "number" },
  { key: "rating", label: "Rating", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
];

export default function TeacherDetailPage() {
  const { role, id } = useParams({ from: "/$role/faculty/teachers/$id" });
  const { edit } = useSearch({ from: "/$role/faculty/teachers/$id" });
  const storageKey = `${role}/faculty/teachers`;
  const [data, setData] = usePersistedRecords<Teacher>(storageKey, seed);
  const record = data.find((t) => t.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/faculty/teachers`}
        moduleLabel="Teachers"
        recordId={id}
      />
    );
  }

  return (
    <RecordDetailPage
      variant="teacher"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/faculty/teachers`}
      moduleLabel="Teachers"
      recordTitle={record.name}
      exclude={["avatar", "subjects"]}
      initialEdit={edit}
      onSave={(vals) =>
        setData((d) => d.map((t) => (t.id === id ? { ...t, ...vals, subjects: t.subjects } as Teacher : t)))
      }
      onDelete={() => setData((d) => d.filter((t) => t.id !== id))}
    />
  );
}
