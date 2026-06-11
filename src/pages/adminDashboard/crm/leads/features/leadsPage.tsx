import { useMemo, useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge, statusTone } from "@/components/ui/StatusBadge";
import { StatsCard } from "@/components/ui/StatsCard";
import { Modal } from "@/components/ui/Modal";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addLead, removeLead, type Lead } from "@/store/slices/leadsSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";



const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email(),
  phone: z.string().min(7),
  program: z.string().min(2),
  source: z.enum(["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"]),
  value: z.coerce.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function LeadsPage() {
  const leads = useAppSelector((s) => s.leads.items);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Lead | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const stats = useMemo(() => {
    const total = leads.length;
    const won = leads.filter((l) => l.stage === "won").length;
    const qualified = leads.filter((l) => ["qualified", "proposal"].includes(l.stage)).length;
    const value = leads.reduce((a, b) => a + b.value, 0);
    return { total, won, qualified, value };
  }, [leads]);

  const onSubmit = (data: FormData) => {
    dispatch(addLead({
      id: `LD-${Date.now()}`,
      ...data,
      stage: "new",
      score: 50,
      owner: "You",
      createdAt: new Date().toISOString(),
    }));
    reset();
    setOpen(false);
  };

  const columns: ColumnDef<Lead>[] = [
    {
      header: "Lead", accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { header: "Program", accessorKey: "program" },
    { header: "Source", accessorKey: "source", cell: ({ getValue }) => <Badge tone="accent">{String(getValue())}</Badge> },
    { header: "Stage", accessorKey: "stage", cell: ({ getValue }) => <Badge tone={statusTone(String(getValue()))}>{String(getValue())}</Badge> },
    { header: "Score", accessorKey: "score", cell: ({ getValue }) => {
      const v = Number(getValue());
      return (
        <div className="flex items-center gap-2 w-28">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full gradient-primary" style={{ width: `${v}%` }} />
          </div>
          <span className="text-xs font-medium w-6 text-right">{v}</span>
        </div>
      );
    } },
    { header: "Value", accessorKey: "value", cell: ({ getValue }) => <span className="font-semibold">${Number(getValue()).toLocaleString()}</span> },
    { header: "Owner", accessorKey: "owner" },
    {
      header: "", id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => setView(row.original)} className="p-1.5 rounded-md hover:bg-muted"><EyeIcon className="w-4 h-4" /></button>
          <button onClick={() => dispatch(removeLead(row.original.id))} className="p-1.5 rounded-md hover:bg-danger/10 text-danger"><TrashIcon className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm">Track every prospect from inquiry to enrolment.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/crm/pipeline" className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Pipeline view</Link>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium shadow-elegant">
            <PlusIcon className="w-4 h-4" /> New Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Leads" value={stats.total} icon="UsersIcon" tone="primary" />
        <StatsCard title="Qualified" value={stats.qualified} icon="CheckBadgeIcon" tone="accent" delta={6} />
        <StatsCard title="Won" value={stats.won} icon="TrophyIcon" tone="success" delta={12} />
        <StatsCard title="Pipeline Value" value={`$${(stats.value / 1000).toFixed(0)}K`} icon="BanknotesIcon" tone="warning" delta={9} />
      </div>

      <DataTable data={leads} columns={columns} searchPlaceholder="Search leads…" />

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Lead"
        footer={<>
          <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg border border-border text-sm">Cancel</button>
          <button form="lead-form" type="submit" className="px-3 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">Create lead</button>
        </>}>
        <form id="lead-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
          {([
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Phone", "tel"],
            ["program", "Program", "text"],
            ["value", "Deal value", "number"],
          ] as const).map(([k, label, type]) => (
            <div key={k} className={k === "name" ? "col-span-2" : ""}>
              <label className="text-xs font-medium">{label}</label>
              <input type={type} {...register(k)} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
              {errors[k] && <p className="text-xs text-danger mt-1">{errors[k]?.message as string}</p>}
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-xs font-medium">Source</label>
            <select {...register("source")} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm">
              {["Website", "Referral", "Social Media", "Event", "Walk-in", "Email Campaign"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title="Lead Details" size="lg">
        {view && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                {view.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{view.name}</h3>
                <p className="text-sm text-muted-foreground">{view.email} · {view.phone}</p>
              </div>
              <Badge tone={statusTone(view.stage)}>{view.stage}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[["Program", view.program], ["Source", view.source], ["Score", view.score], ["Value", `$${view.value.toLocaleString()}`], ["Owner", view.owner], ["Created", new Date(view.createdAt).toLocaleDateString()]].map(([k, v]) => (
                <div key={k as string} className="p-3 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Timeline</p>
              <ul className="space-y-2 text-sm">
                {["Created", "Email sent", "Discovery call scheduled"].map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                    <div><p>{t}</p><p className="text-xs text-muted-foreground">{i + 1} day(s) ago</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
