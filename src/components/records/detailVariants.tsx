import { Badge, statusTone } from "@/components/ui/StatusBadge";
import type { ReactNode } from "react";

export type DetailVariant =
  | "generic"
  | "student"
  | "teacher"
  | "admission"
  | "fee"
  | "exam"
  | "lead";

function FieldGrid({
  entries,
}: {
  entries: [string, unknown][];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {entries.map(([k, v]) => {
        const isStatus = /^(status|stage)$/i.test(k);
        const label = k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
        return (
          <div key={k} className="p-4 rounded-xl bg-muted/30 border border-border/40">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
            <div className="mt-1.5 text-sm font-medium break-words">
              {isStatus ? (
                <Badge tone={statusTone(String(v))}>{String(v)}</Badge>
              ) : (
                String(v ?? "—")
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Hero({
  title,
  subtitle,
  badge,
  avatar,
  accent = "primary",
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  avatar?: ReactNode;
  accent?: "primary" | "accent" | "success" | "warning";
}) {
  const glow = {
    primary: "bg-primary/15",
    accent: "bg-accent/15",
    success: "bg-success/15",
    warning: "bg-warning/15",
  }[accent];

  return (
    <div className={`relative rounded-2xl p-5 sm:p-6 ${glow} border border-border/40 overflow-hidden`}>
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative flex flex-wrap items-center gap-4">
        {avatar}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {badge}
      </div>
    </div>
  );
}

export function RecordDetailView({
  variant,
  record,
  exclude = [],
}: {
  variant: DetailVariant;
  record: Record<string, unknown>;
  exclude?: string[];
}) {
  const entries = Object.entries(record).filter(
    ([k, v]) => !exclude.includes(k) && typeof v !== "object" && k !== "avatar",
  );

  if (variant === "student" || variant === "teacher") {
    const name = String(record.name ?? record.applicant ?? "—");
    const avatarUrl = record.avatar as string | undefined;
    return (
      <div className="space-y-5">
        <Hero
          title={name}
          subtitle={[record.email, record.department ?? record.program].filter(Boolean).join(" · ") as string}
          badge={
            record.status ? (
              <Badge tone={statusTone(String(record.status))}>{String(record.status)}</Badge>
            ) : undefined
          }
          avatar={
            avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-background shadow-elegant" />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {name[0]}
              </div>
            )
          }
        />
        {(variant === "student" && (record.cgpa != null || record.attendance != null)) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["CGPA", record.cgpa],
              ["Attendance", record.attendance != null ? `${record.attendance}%` : null],
              ["Program", record.program],
              ["Section", record.section],
            ]
              .filter(([, v]) => v != null && v !== "")
              .map(([label, val]) => (
                <div key={label as string} className="glass-card rounded-xl p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold mt-1">{String(val)}</p>
                </div>
              ))}
          </div>
        )}
        {variant === "teacher" && record.rating != null && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ["Rating", `★ ${record.rating}`],
              ["Experience", `${record.experience} yrs`],
              ["Department", record.department],
            ].map(([label, val]) => (
              <div key={label as string} className="glass-card rounded-xl p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-lg font-bold mt-1">{String(val ?? "—")}</p>
              </div>
            ))}
          </div>
        )}
        <FieldGrid entries={entries.filter(([k]) => !["name", "email", "cgpa", "attendance", "program", "section", "rating", "experience", "department"].includes(k))} />
      </div>
    );
  }

  if (variant === "admission") {
    const steps = ["Submitted", "Under Review", "Approved", "Rejected", "Waitlisted"];
    const current = String(record.status ?? "Submitted");
    const stepIdx = steps.indexOf(current);
    return (
      <div className="space-y-5">
        <Hero
          title={String(record.applicant ?? "Application")}
          subtitle={String(record.program ?? "")}
          badge={<Badge tone={statusTone(current)}>{current}</Badge>}
          accent="accent"
        />
        <div className="glass-card rounded-xl p-4 overflow-x-auto">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Application progress</p>
          <div className="flex items-center gap-1 min-w-[28rem]">
            {steps.slice(0, 4).map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-1">
                <div
                  className={`h-2 flex-1 rounded-full ${i <= stepIdx && stepIdx < 3 ? "gradient-primary" : i === stepIdx && stepIdx >= 3 ? "bg-danger" : "bg-muted"}`}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Current stage: {current}</p>
        </div>
        <FieldGrid entries={entries.filter(([k]) => !["applicant", "program", "status"].includes(k))} />
      </div>
    );
  }

  if (variant === "fee") {
    const due = Number(record.due ?? 0);
    const paid = Number(record.paid ?? 0);
    const amount = Number(record.amount ?? paid + due);
    const pct = amount > 0 ? Math.round((paid / amount) * 100) : 0;
    return (
      <div className="space-y-5">
        <Hero
          title={String(record.invoice ?? record.id ?? "Invoice")}
          subtitle={String(record.student ?? "")}
          badge={record.status ? <Badge tone={statusTone(String(record.status))}>{String(record.status)}</Badge> : undefined}
          accent="warning"
        />
        <div className="glass-card rounded-xl p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Payment progress</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-center text-sm">
            <div><p className="text-muted-foreground text-xs">Total</p><p className="font-bold">${amount.toLocaleString()}</p></div>
            <div><p className="text-muted-foreground text-xs">Paid</p><p className="font-bold text-success">${paid.toLocaleString()}</p></div>
            <div><p className="text-muted-foreground text-xs">Due</p><p className="font-bold text-warning">${due.toLocaleString()}</p></div>
          </div>
        </div>
        <FieldGrid entries={entries.filter(([k]) => !["invoice", "student", "amount", "paid", "due", "status"].includes(k))} />
      </div>
    );
  }

  if (variant === "exam") {
    const date = record.date ? new Date(String(record.date)) : null;
    return (
      <div className="space-y-5">
        <Hero
          title={String(record.title ?? "Exam")}
          subtitle={String(record.program ?? "")}
          badge={record.status ? <Badge tone={statusTone(String(record.status))}>{String(record.status)}</Badge> : undefined}
        />
        {date && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-4 text-center col-span-1">
              <p className="text-[10px] uppercase text-muted-foreground">Date</p>
              <p className="text-lg font-bold mt-1">{date.toLocaleDateString()}</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">Duration</p>
              <p className="text-lg font-bold mt-1">{String(record.duration)} min</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-[10px] uppercase text-muted-foreground">Type</p>
              <p className="text-lg font-bold mt-1">{String(record.type)}</p>
            </div>
          </div>
        )}
        <FieldGrid entries={entries.filter(([k]) => !["title", "program", "date", "duration", "type", "status"].includes(k))} />
      </div>
    );
  }

  if (variant === "lead") {
    const name = String(record.name ?? "Lead");
    return (
      <div className="space-y-5">
        <Hero
          title={name}
          subtitle={[record.email, record.phone].filter(Boolean).join(" · ") as string}
          badge={record.stage ? <Badge tone={statusTone(String(record.stage))}>{String(record.stage)}</Badge> : undefined}
          avatar={
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              {name[0]}
            </div>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ["Program", record.program],
            ["Source", record.source],
            ["Score", record.score],
            ["Value", record.value != null ? `$${Number(record.value).toLocaleString()}` : null],
            ["Owner", record.owner],
          ]
            .filter(([, v]) => v != null)
            .map(([label, val]) => (
              <div key={label as string} className="glass-card rounded-xl p-4">
                <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
                <p className="font-semibold mt-1">{String(val)}</p>
              </div>
            ))}
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Activity timeline</p>
          <ul className="space-y-3">
            {["Lead created", "Email sent", "Discovery call scheduled"].map((t, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p>{t}</p>
                  <p className="text-xs text-muted-foreground">{i + 1} day(s) ago</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <FieldGrid entries={entries.filter(([k]) => !["name", "email", "phone", "program", "source", "score", "value", "owner", "stage"].includes(k))} />
      </div>
    );
  }

  // generic
  const name = String(record.name ?? record.title ?? record.applicant ?? record.id ?? "Record");
  return (
    <div className="space-y-5">
      <Hero
        title={name}
        subtitle={String(record.reference ?? record.id ?? "")}
        badge={
          record.status ? (
            <Badge tone={statusTone(String(record.status))}>{String(record.status)}</Badge>
          ) : undefined
        }
      />
      {record.value != null && (
        <div className="glass-card rounded-xl p-5 text-center max-w-xs">
          <p className="text-xs uppercase text-muted-foreground">Value</p>
          <p className="text-3xl font-bold mt-1">${Number(record.value).toLocaleString()}</p>
        </div>
      )}
      <FieldGrid entries={entries.filter(([k]) => !["name", "reference", "value", "status"].includes(k))} />
    </div>
  );
}
