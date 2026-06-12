import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { students as seed, type Student } from "@/mockData";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const SECTIONS = ["A", "B", "C"];
const STATUSES: Student["status"][] = ["Active", "On Leave", "Graduated"];

const fields: FieldDef[] = [
  { key: "name", label: "Full name", required: true, span: 2 },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "rollNo", label: "Roll number" },
  { key: "program", label: "Program", type: "select", options: PROGRAMS },
  { key: "batch", label: "Batch" },
  { key: "section", label: "Section", type: "select", options: SECTIONS },
  { key: "cgpa", label: "CGPA", type: "number" },
  { key: "attendance", label: "Attendance %", type: "number" },
  { key: "guardian", label: "Guardian" },
  { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
];

export default function StudentDetailPage() {
  const { role, id } = useParams({ from: "/$role/students/list/$id" });
  const { edit } = useSearch({ from: "/$role/students/list/$id" });
  const storageKey = `${role}/students/list`;
  const [data, setData] = usePersistedRecords<Student>(storageKey, seed);
  const record = data.find((s) => s.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/students/list`}
        moduleLabel="Students"
        recordId={id}
      />
    );
  }

  return (
    <RecordDetailPage
      variant="student"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/students/list`}
      moduleLabel="Students"
      recordTitle={record.name}
      exclude={["avatar"]}
      initialEdit={edit}
      onSave={(vals) =>
        setData((d) => d.map((s) => (s.id === id ? { ...s, ...vals } as Student : s)))
      }
      onDelete={() => setData((d) => d.filter((s) => s.id !== id))}
    />
  );
}
