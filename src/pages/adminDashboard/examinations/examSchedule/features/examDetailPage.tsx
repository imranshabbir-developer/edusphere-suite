import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { usePersistedRecords } from "@/hooks/usePersistedRecords";
import { exams as seed, type Exam } from "@/mockData";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const PROGRAMS = ["MBA", "B.Tech CSE", "B.Sc Physics", "M.Tech AI", "BBA", "MA English"];
const TYPES: Exam["type"][] = ["Mid-term", "Final", "Quiz", "Practical"];
const STATUSES: Exam["status"][] = ["Scheduled", "Live", "Completed"];

const fields: FieldDef[] = [
  { key: "title", label: "Exam title", required: true, span: 2 },
  { key: "program", label: "Program", type: "select", options: PROGRAMS },
  { key: "type", label: "Type", type: "select", options: TYPES as unknown as string[] },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "duration", label: "Duration (min)", type: "number" },
  { key: "status", label: "Status", type: "select", options: STATUSES as unknown as string[], span: 2 },
];

export default function ExamDetailPage() {
  const { role, id } = useParams({ from: "/$role/exams/schedule/$id" });
  const { edit } = useSearch({ from: "/$role/exams/schedule/$id" });
  const storageKey = `${role}/exams/schedule`;
  const [data, setData] = usePersistedRecords<Exam>(storageKey, seed);
  const record = data.find((e) => e.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/exams/schedule`}
        moduleLabel="Exam Schedule"
        recordId={id}
      />
    );
  }

  const displayRecord = {
    ...record,
    date: record.date ? new Date(record.date).toISOString().slice(0, 10) : record.date,
  };

  return (
    <RecordDetailPage
      variant="exam"
      record={displayRecord as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/exams/schedule`}
      moduleLabel="Exam Schedule"
      recordTitle={record.title}
      initialEdit={edit}
      onSave={(vals) =>
        setData((d) =>
          d.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...vals,
                  date: vals.date ? new Date(String(vals.date)).toISOString() : e.date,
                } as Exam
              : e,
          ),
        )
      }
      onDelete={() => setData((d) => d.filter((e) => e.id !== id))}
    />
  );
}
