import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import type { FieldDef } from "@/components/ui/RecordDialogs";
import { RecordInlineForm } from "./RecordInlineForm";
import { RecordDetailView, type DetailVariant } from "./detailVariants";
import { ActionFeedbackModal, type FeedbackAction } from "./ActionFeedbackModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface Props {
  variant: DetailVariant;
  record: Record<string, unknown>;
  fields: FieldDef[];
  listPath: string;
  moduleLabel: string;
  recordTitle: string;
  exclude?: string[];
  initialEdit?: boolean;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}

export function RecordDetailPage({
  variant,
  record,
  fields,
  listPath,
  moduleLabel,
  recordTitle,
  exclude = [],
  initialEdit = false,
  onSave,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(initialEdit);
  const [draft, setDraft] = useState(record);
  const [feedback, setFeedback] = useState<FeedbackAction | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [navigateAfterFeedback, setNavigateAfterFeedback] = useState(false);

  useEffect(() => {
    setDraft(record);
  }, [record]);

  const showFeedback = (action: FeedbackAction) => {
    setFeedback(action);
    setFeedbackOpen(true);
  };

  const handleSave = (vals: Record<string, unknown>) => {
    onSave(vals);
    setDraft({ ...draft, ...vals });
    setEditing(false);
    showFeedback("saved");
  };

  const handleDelete = () => {
    onDelete();
    setNavigateAfterFeedback(true);
    showFeedback("deleted");
  };

  const closeFeedback = () => {
    setFeedbackOpen(false);
    if (navigateAfterFeedback) {
      setNavigateAfterFeedback(false);
      navigate({ to: listPath });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={listPath}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to {moduleLabel}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit record
              </button>
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-danger/30 bg-danger/5 text-danger text-sm font-semibold hover:bg-danger/10 transition"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(record);
                  setEditing(false);
                }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="record-inline-form"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant"
              >
                <CheckIcon className="w-4 h-4" />
                Save changes
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{moduleLabel}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{recordTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">{String(record.id ?? "")}</p>
      </div>

      <div className="glass-card rounded-2xl p-5 sm:p-6">
        {editing ? (
          <RecordInlineForm fields={fields} initial={draft} onSubmit={handleSave} />
        ) : (
          <RecordDetailView variant={variant} record={draft} exclude={exclude} />
        )}
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        recordName={recordTitle}
      />
      <ActionFeedbackModal
        action={feedback}
        open={feedbackOpen}
        onClose={closeFeedback}
      />
    </div>
  );
}
