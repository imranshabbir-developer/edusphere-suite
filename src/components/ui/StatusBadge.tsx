// Custom Badge component for SaaS app — keeps casing distinct from shadcn ui/badge.tsx
import type { ReactNode } from "react";

export function Badge({ tone = "default", children }: { tone?: "default" | "success" | "warning" | "danger" | "primary" | "accent"; children: ReactNode }) {
  const map = {
    default: "bg-muted text-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    accent: "bg-accent/10 text-accent",
  } as const;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${map[tone]}`}>{children}</span>;
}

export function statusTone(s: string): "success" | "warning" | "danger" | "primary" | "default" | "accent" {
  const v = s.toLowerCase();
  if (["active", "approved", "paid", "completed", "published", "won"].some((k) => v.includes(k))) return "success";
  if (["pending", "partial", "review", "scheduled", "waitlisted", "draft", "submitted", "qualified"].some((k) => v.includes(k))) return "warning";
  if (["overdue", "rejected", "closed", "lost", "archived"].some((k) => v.includes(k))) return "danger";
  if (["live", "open", "new", "contacted", "proposal"].some((k) => v.includes(k))) return "primary";
  if (["leave", "graduated"].some((k) => v.includes(k))) return "accent";
  return "default";
}
