import { useParams, useSearch } from "@tanstack/react-router";
import { RecordDetailPage } from "@/components/records/RecordDetailPage";
import { RecordNotFound } from "@/components/records/RecordNotFound";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { updateLead, removeLead, type Lead } from "@/store/slices/leadsSlice";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const fields: FieldDef[] = [
  { key: "name", label: "Full name", required: true, span: 2 },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "program", label: "Program" },
  { key: "source", label: "Source", type: "select", options: ["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"] },
  { key: "stage", label: "Stage", type: "select", options: ["new", "contacted", "qualified", "proposal", "won", "lost"] },
  { key: "score", label: "Score", type: "number" },
  { key: "value", label: "Deal value", type: "number" },
  { key: "owner", label: "Owner" },
];

export default function LeadDetailPage() {
  const { role, id } = useParams({ from: "/$role/crm/leads/$id" });
  const { edit } = useSearch({ from: "/$role/crm/leads/$id" });
  const dispatch = useAppDispatch();
  const leads = useAppSelector((s) => s.leads.items);
  const record = leads.find((l) => l.id === id);

  if (!record) {
    return (
      <RecordNotFound
        listPath={`/${role}/crm/leads`}
        moduleLabel="Leads"
        recordId={id}
      />
    );
  }

  return (
    <RecordDetailPage
      variant="lead"
      record={record as unknown as Record<string, unknown>}
      fields={fields}
      listPath={`/${role}/crm/leads`}
      moduleLabel="Leads"
      recordTitle={record.name}
      initialEdit={edit}
      onSave={(vals) =>
        dispatch(
          updateLead({
            ...record,
            ...vals,
            score: Number(vals.score ?? record.score),
            value: Number(vals.value ?? record.value),
          } as Lead),
        )
      }
      onDelete={() => dispatch(removeLead(id))}
    />
  );
}
