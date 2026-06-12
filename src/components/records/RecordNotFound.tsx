import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  listPath: string;
  moduleLabel: string;
  recordId: string;
}

export function RecordNotFound({ listPath, moduleLabel, recordId }: Props) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        to={listPath}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to {moduleLabel}
      </Link>
      <div className="glass-card rounded-2xl p-8 text-center">
        <h1 className="text-xl font-bold tracking-tight">Record not found</h1>
        <p className="text-muted-foreground text-sm mt-2">
          No record matching <span className="font-mono text-foreground">{recordId}</span> exists in this
          list. It may have been deleted or the link is outdated.
        </p>
      </div>
    </div>
  );
}
