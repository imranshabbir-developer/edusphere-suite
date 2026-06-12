import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { admissions as seed, type Admission } from "@/mockData";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const STATUSES: Admission["status"][] = ["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"];

const fields: FieldDef[] = [
  { key: "applicant", label: "Applicant name", required: true, span: 2 },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "program", label: "Program", type: "select", options: PROGRAMS },
  { key: "score", label: "Score", type: "number" },
  { key: "documents", label: "Documents", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[] },
];

export default function ApplicationDetailPage() {
  const { role, id } = useParams({ from: "/$role/admissions/applications/$id" });
  const { edit } = useSearch({ from: "/$role/admissions/applications/$id" });
  const storageKey = `${role}/admissions/applications`;
  const [data, setData] = usePersistedRecords<Admission>(storageKey, seed);
  const record = data.find((a) => a.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/admissions/applications`}
        moduleLabel="Applications"
        recordId={id}
      />
    );
  }

  return (
    <RecordDetailPage
      variant="admission"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/admissions/applications`}
      moduleLabel="Applications"
      recordTitle={record.applicant}
      initialEdit={edit}
      onSave={(vals) =>
        setData((d) => d.map((a) => (a.id === id ? { ...a, ...vals } as Admission : a)))
      }
      onDelete={() => setData((d) => d.filter((a) => a.id !== id))}
    />
  );
}
