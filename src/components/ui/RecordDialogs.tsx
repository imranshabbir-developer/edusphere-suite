import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Badge, statusTone } from "./StatusBadge";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "email" | "tel" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  span?: 1 | 2;
}

interface FormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FieldDef[];
  initial?: object | null;
  onSubmit: (values: Record<string, unknown>) => void;
  submitLabel?: string;
}

export function RecordFormModal({ open, onClose, title, fields, initial, onSubmit, submitLabel = "Save" }: FormProps) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setValues((initial as Record<string, unknown>) ?? Object.fromEntries(fields.map((f) => [f.key, ""])));
      setErrors({});
    }
  }, [open, initial, fields]);

  const set = (k: string, v: unknown) => setValues((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !values[f.key]) errs[f.key] = `${f.label} is required`;
    });
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(values);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg"
      footer={<>
        <button onClick={onClose} className="px-3 py-2 rounded-lg border border-border text-sm">Cancel</button>
        <button form="record-form" type="submit" className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">{submitLabel}</button>
      </>}>
      <form id="record-form" onSubmit={submit} className="grid grid-cols-2 gap-3">
        {fields.map((f) => {
          const v = (values[f.key] as string | number | undefined) ?? "";
          const cls = "w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm";
          return (
            <div key={f.key} className={f.span === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}>
              <label className="text-xs font-medium">{f.label}{f.required && <span className="text-danger"> *</span>}</label>
              <div className="mt-1">
                {f.type === "textarea" ? (
                  <textarea rows={3} value={v as string} onChange={(e) => set(f.key, e.target.value)} className={cls} />
                ) : f.type === "select" ? (
                  <select value={v as string} onChange={(e) => set(f.key, e.target.value)} className={cls}>
                    <option value="">Select…</option>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type ?? "text"} value={v as string}
                    onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} className={cls} />
                )}
              </div>
              {errors[f.key] && <p className="text-xs text-danger mt-1">{errors[f.key]}</p>}
            </div>
          );
        })}
      </form>
    </Modal>
  );
}

interface DetailProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  record: object | null | undefined;
  exclude?: string[];
  extra?: ReactNode;
}

export function RecordDetailModal({ open, onClose, title = "Record details", record, exclude = [], extra }: DetailProps) {
  if (!record) return null;
  const entries = Object.entries(record as Record<string, unknown>).filter(([k, v]) => !exclude.includes(k) && typeof v !== "object");
  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([k, v]) => {
          const isStatus = /^(status|stage)$/i.test(k);
          return (
            <div key={k} className="p-3 rounded-lg bg-muted/40">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.replace(/([A-Z])/g, " $1")}</p>
              <div className="mt-1 text-sm font-medium break-words">
                {isStatus ? <Badge tone={statusTone(String(v))}>{String(v)}</Badge> : String(v ?? "—")}
              </div>
            </div>
          );
        })}
      </div>
      {extra && <div className="mt-4">{extra}</div>}
    </Modal>
  );
}

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}
export function ConfirmDialog({ open, onClose, onConfirm, title = "Delete record?", message = "This action cannot be undone." }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}
      footer={<>
        <button onClick={onClose} className="px-3 py-2 rounded-lg border border-border text-sm">Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg bg-danger text-danger-foreground text-sm font-medium">Delete</button>
      </>}>
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>
  );
}
