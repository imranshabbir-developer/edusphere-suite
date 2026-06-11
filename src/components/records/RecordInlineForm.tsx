import { useEffect, useState } from "react";
import type { FieldDef } from "@/components/ui/RecordDialogs";

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm";

export function RecordInlineForm({
  fields,
  initial,
  onSubmit,
  formId = "record-inline-form",
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  formId?: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  const set = (k: string, v: unknown) => setValues((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !values[f.key]) errs[f.key] = `${f.label} is required`;
    });
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(values);
  };

  return (
    <form id={formId} onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => {
        const v = (values[f.key] as string | number | undefined) ?? "";
        return (
          <div key={f.key} className={f.span === 2 ? "sm:col-span-2" : ""}>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {f.label}
              {f.required && <span className="text-danger"> *</span>}
            </label>
            <div className="mt-1.5">
              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={v as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={inputCls}
                />
              ) : f.type === "select" ? (
                <select
                  value={v as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={v as string}
                  onChange={(e) =>
                    set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  className={inputCls}
                />
              )}
            </div>
            {errors[f.key] && <p className="text-xs text-danger mt-1">{errors[f.key]}</p>}
          </div>
        );
      })}
    </form>
  );
}
